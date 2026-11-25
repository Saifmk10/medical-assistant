const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { mock, test } = require('node:test');
const ts = require('../mobile/node_modules/typescript');

global.__DEV__ = false;

function createProvider() {
  const effects = [];
  const states = [];
  let session;
  let playback;
  let microphoneHandler;
  let resolveStart;
  let rejectStart;
  let started = false;
  let released = false;
  let stops = 0;
  let playbackCloses = 0;
  const sent = [];
  const stream = {
    start() {
      started = true;
      return new Promise((resolve, reject) => {
        resolveStart = resolve;
        rejectStart = reject;
      });
    },
    stop() {
      if (released) throw new Error('Cannot stop a released stream');
      stops++;
    },
  };
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    createElement: (type, props) => ({ type, props }),
    useCallback: (callback) => callback,
    useContext: () => undefined,
    useEffect: (effect) => { effects.push(effect); },
    useRef: (current) => ({ current }),
    useState: (initial) => {
      const index = states.length;
      states.push(typeof initial === 'function' ? initial() : initial);
      return [states[index], (update) => {
        states[index] = typeof update === 'function' ? update(states[index]) : update;
      }];
    },
  };
  react.default = react;
  react.__esModule = true;
  class AnimatedValue {
    setValue() {}
    stopAnimation() {}
  }
  const mocks = {
    react,
    'react-native': { Animated: { Value: AnimatedValue, timing: () => ({ start() {} }) }, Easing: { linear: () => {} } },
    'expo-audio': {
      requestRecordingPermissionsAsync: async () => ({ granted: true }),
      setAudioModeAsync: async () => {},
      useAudioStream: (options) => {
        microphoneHandler = options.onBuffer;
        react.useEffect(() => () => { released = true; });
        return { stream };
      },
    },
    '../services/voiceService': {
      VoiceSession: class {
        constructor(callbacks) {
          this.callbacks = callbacks;
          session = this;
        }
        async connect() {}
        close() {}
        sendMicrophoneAudio(data) { sent.push(data); return true; }
      },
    },
    '../services/pcmAudioPlayer': {
      PcmAudioPlayer: class {
        constructor(onPlaybackStart, onPlaybackComplete) {
          this.onPlaybackStart = onPlaybackStart;
          this.onPlaybackComplete = onPlaybackComplete;
          playback = this;
        }
        async resume() {}
        async close() { playbackCloses++; }
        enqueue() {}
        finishTurn() {}
        interrupt() {}
      },
    },
  };
  const filename = path.resolve(__dirname, '../mobile/src/context/VoiceAssistantContext.tsx');
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.require = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    throw new Error(`Unexpected dependency: ${id}`);
  };
  loaded._compile(output, filename);
  const provider = loaded.exports.VoiceAssistantProvider({ children: null });
  const cleanups = effects.map((effect) => effect()).filter(Boolean);
  return {
    toggle: provider.props.value.toggleListening,
    unmount: () => cleanups.forEach((cleanup) => cleanup()),
    get started() { return started; },
    get stops() { return stops; },
    get playbackCloses() { return playbackCloses; },
    get session() { return session; },
    get playback() { return playback; },
    get sentMicrophoneChunks() { return sent.length; },
    get state() { return states[0]; },
    get messages() { return states[1]; },
    speak: () => microphoneHandler({ data: new ArrayBuffer(4), sampleRate: 16_000, channels: 1, timestamp: 0 }),
    resolveStart: () => resolveStart(),
    rejectStart: () => rejectStart(new Error('Stream released during start')),
  };
}

async function startPending(provider) {
  const result = provider.toggle();
  for (let i = 0; i < 10 && !provider.started; i++) await Promise.resolve();
  assert.equal(provider.started, true);
  return { result };
}

async function startListening(provider) {
  const { result } = await startPending(provider);
  provider.resolveStart();
  await result;
  assert.equal(provider.state, 'listening');
}

test('late reply transcripts do not mute the microphone or stick the UI on "responding"', async () => {
  const provider = createProvider();
  await startListening(provider);
  provider.session.callbacks.onOutputTranscript('namaste');
  provider.speak();
  assert.equal(provider.sentMicrophoneChunks, 1);
  assert.equal(provider.state, 'listening');
});

test('the microphone reopens as soon as reply playback completes', async () => {
  const provider = createProvider();
  await startListening(provider);
  provider.playback.onPlaybackStart();
  provider.speak();
  assert.equal(provider.sentMicrophoneChunks, 0);
  assert.equal(provider.state, 'responding');

  provider.playback.onPlaybackComplete();
  provider.speak();
  assert.equal(provider.sentMicrophoneChunks, 1);
  assert.equal(provider.state, 'listening');
});

test('a server interruption reopens the microphone immediately', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const provider = createProvider();
    await startListening(provider);
    provider.playback.onPlaybackStart();
    provider.session.callbacks.onInterrupted();
    provider.speak();
    assert.equal(provider.sentMicrophoneChunks, 1);
  } finally {
    mock.timers.reset();
  }
});

test('a second turn sends microphone audio after the first reply finishes', async () => {
  const provider = createProvider();
  await startListening(provider);
  provider.speak();
  provider.session.callbacks.onAudio(new ArrayBuffer(4));
  provider.playback.onPlaybackStart();
  provider.speak();
  assert.equal(provider.sentMicrophoneChunks, 1);
  provider.session.callbacks.onTurnComplete();
  provider.playback.onPlaybackComplete();
  provider.speak();
  assert.equal(provider.sentMicrophoneChunks, 2);
});

test('user transcript fragments grow one message per turn without leaving "listening"', async () => {
  const provider = createProvider();
  await startListening(provider);
  const { callbacks } = provider.session;
  callbacks.onInputTranscript('नमस्ते ');
  callbacks.onInputTranscript('I need ');
  callbacks.onInputTranscript('a doctor');
  assert.equal(provider.state, 'listening');
  const userMessages = () => provider.messages.filter((message) => message.role === 'user');
  assert.equal(userMessages().length, 1);
  assert.equal(userMessages()[0].text, 'नमस्ते I need a doctor');

  callbacks.onOutputTranscript('Sure');
  callbacks.onInputTranscript('thanks');
  assert.equal(userMessages().length, 2);
  assert.equal(userMessages()[1].text, 'thanks');
});

test('unmount does not stop the stream after Expo releases it', () => {
  const provider = createProvider();
  assert.doesNotThrow(provider.unmount);
  assert.equal(provider.stops, 0);
});

test('ending an active session still stops the microphone', async () => {
  const provider = createProvider();
  const { result } = await startPending(provider);
  provider.resolveStart();
  await result;
  await provider.toggle();
  assert.equal(provider.stops, 1);
  assert.equal(provider.playbackCloses, 1);
  assert.doesNotThrow(provider.unmount);
});

for (const outcome of ['resolveStart', 'rejectStart']) {
  test(`pending microphone start can ${outcome} after unmount`, async () => {
    const provider = createProvider();
    const { result } = await startPending(provider);
    provider.unmount();
    provider[outcome]();
    await assert.doesNotReject(result);
    assert.equal(provider.stops, 0);
    assert.equal(provider.playbackCloses, 1);
  });
}
