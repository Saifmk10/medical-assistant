const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { mock, test } = require('node:test');
const ts = require('../mobile/node_modules/typescript');

const SAMPLE_RATE = 24_000;

function createPlayer() {
  let queue;
  let nextBufferId = 0;
  const events = [];
  class Queue {
    constructor() { queue = this; this.starts = 0; }
    connect() {}
    disconnect() {}
    clearBuffers() {}
    stop() {}
    start() { this.starts++; }
    enqueueBuffer() { return String(nextBufferId++); }
  }
  class AudioContext {
    currentTime = 0;
    destination = {};
    async resume() {}
    async close() {}
    createBuffer(_channels, length) {
      return { getChannelData: () => new Float32Array(length), duration: length / SAMPLE_RATE };
    }
    createBufferQueueSource() { return new Queue(); }
  }
  const mocks = {
    'react-native': { Platform: { OS: 'android' } },
    'react-native-audio-api': { AudioContext },
  };
  const filename = path.resolve(__dirname, '../mobile/src/services/pcmAudioPlayer.ts');
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, useDefineForClassFields: true },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.require = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    throw new Error(`Unexpected dependency: ${id}`);
  };
  loaded._compile(output, filename);
  const player = new loaded.exports.PcmAudioPlayer(() => events.push('start'), () => events.push('complete'));
  const chunk = (milliseconds) => new ArrayBuffer((SAMPLE_RATE * milliseconds) / 1000 * 2);
  const endBuffers = () => {
    for (let id = 0; id < nextBufferId; id++) queue.onbufferended({ bufferId: String(id), isLastBufferInQueue: true });
  };
  return { player, events, chunk, endBuffers, get queue() { return queue; } };
}

test('a short reply starts playing without waiting for turn completion', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const { player, events, chunk } = createPlayer();
    player.enqueue(chunk(100));
    assert.deepEqual(events, []);
    mock.timers.tick(250);
    assert.deepEqual(events, ['start']);
  } finally {
    mock.timers.reset();
  }
});

test('playback starts immediately once enough audio is buffered', () => {
  const { player, events, chunk } = createPlayer();
  player.enqueue(chunk(100));
  assert.deepEqual(events, []);
  player.enqueue(chunk(25));
  assert.deepEqual(events, ['start']);
});

test('a long gap in a reply does not complete playback or discard later audio', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const { player, events, chunk, endBuffers } = createPlayer();
    player.enqueue(chunk(400));
    endBuffers();
    mock.timers.tick(2000);
    assert.deepEqual(events, ['start']);
    player.enqueue(chunk(400));
    player.finishTurn();
    assert.deepEqual(events, ['start']);
    endBuffers();
    assert.deepEqual(events, ['start', 'complete']);
  } finally {
    mock.timers.reset();
  }
});

test('completion is reported immediately when the turn is complete and the queue drains', () => {
  const { player, events, chunk, endBuffers } = createPlayer();
  player.enqueue(chunk(400));
  player.finishTurn();
  endBuffers();
  assert.deepEqual(events, ['start', 'complete']);
});
