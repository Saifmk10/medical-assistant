import { Platform } from 'react-native';
import { AudioContext } from 'react-native-audio-api';
import type { AudioBuffer, AudioBufferQueueSourceNode, AudioBufferSourceNode } from 'react-native-audio-api';

const SAMPLE_RATE = 24_000;
// Keep the original 125 ms prebuffer, with a timeout for unusually short replies.
const PREBUFFER_SAMPLES = SAMPLE_RATE / 8;
const MAX_PREBUFFER_WAIT_MS = 250;

export class PcmAudioPlayer {
  private readonly context = new AudioContext({
    sampleRate: SAMPLE_RATE,
    latencyHint: 'interactive',
    androidOutputProfile: 'voiceCommunication',
  });
  private queue: AudioBufferQueueSourceNode | null = null;
  private readonly pendingBuffers: AudioBuffer[] = [];
  private readonly pendingBufferIds = new Set<string>();
  private readonly activeSources = new Set<AudioBufferSourceNode>();
  private pendingSamples = 0;
  private nextPlaybackTime = 0;
  private started = false;
  private queueHasStarted = false;
  private turnComplete = false;
  private closed = false;
  private trailingByte: number | null = null;
  private startTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly onPlaybackStart: () => void,
    private readonly onPlaybackComplete: () => void,
  ) {}

  async resume() {
    await this.context.resume();
  }

  enqueue(data: ArrayBuffer) {
    if (this.closed || data.byteLength === 0) return;
    let bytes = new Uint8Array(data);
    if (this.trailingByte !== null) {
      const combined = new Uint8Array(bytes.byteLength + 1);
      combined[0] = this.trailingByte;
      combined.set(bytes, 1);
      bytes = combined;
      this.trailingByte = null;
    }
    if (bytes.byteLength % 2 !== 0) {
      this.trailingByte = bytes[bytes.byteLength - 1];
      bytes = bytes.subarray(0, bytes.byteLength - 1);
    }
    if (bytes.byteLength === 0) return;

    const sampleCount = bytes.byteLength / 2;
    const audioBuffer = this.context.createBuffer(1, sampleCount, SAMPLE_RATE);
    const samples = audioBuffer.getChannelData(0);
    const pcm = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let index = 0; index < sampleCount; index++) {
      samples[index] = pcm.getInt16(index * 2, true) / 32_768;
    }

    if (Platform.OS === 'web') {
      this.pendingBuffers.push(audioBuffer);
    } else {
      const queue = this.getQueue();
      this.pendingBufferIds.add(queue.enqueueBuffer(audioBuffer));
    }
    this.pendingSamples += sampleCount;
    if (!this.started && this.pendingSamples >= PREBUFFER_SAMPLES) this.startPlayback();
    else if (this.started && Platform.OS === 'web') this.scheduleWebBuffers();
    else if (!this.started && !this.startTimer) {
      this.startTimer = setTimeout(() => {
        this.startTimer = null;
        this.startPlayback();
      }, MAX_PREBUFFER_WAIT_MS);
    }
  }

  finishTurn() {
    this.turnComplete = true;
    if (this.trailingByte !== null) {
      this.trailingByte = null;
      throw new Error('Voice service returned an incomplete PCM audio sample.');
    }
    if (!this.started && this.pendingSamples > 0) this.startPlayback();
    else this.finishIfDrained();
  }

  interrupt() {
    this.resetPlayback();
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    this.resetPlayback();
    await this.context.close();
  }

  private getQueue() {
    if (this.queue) return this.queue;
    const queue = this.context.createBufferQueueSource();
    queue.connect(this.context.destination);
    queue.onbufferended = ({ bufferId }) => {
      this.pendingBufferIds.delete(bufferId);
      this.finishIfDrained();
    };
    this.queue = queue;
    return queue;
  }

  private startPlayback() {
    if (this.started || this.closed) return;
    this.clearStartTimer();
    this.started = true;
    this.onPlaybackStart();

    if (Platform.OS === 'web') {
      this.scheduleWebBuffers();
    } else {
      this.getQueue().start(this.context.currentTime + 0.02);
      this.queueHasStarted = true;
    }
  }

  private scheduleWebBuffers() {
    while (this.pendingBuffers.length > 0) {
      const buffer = this.pendingBuffers.shift();
      if (!buffer) continue;
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.onended = () => {
        this.activeSources.delete(source);
        this.finishIfDrained();
      };
      this.nextPlaybackTime = Math.max(this.nextPlaybackTime, this.context.currentTime + 0.02);
      source.start(this.nextPlaybackTime);
      this.nextPlaybackTime += buffer.duration;
      this.activeSources.add(source);
    }
  }

  private hasPendingAudio() {
    return Platform.OS === 'web'
      ? this.pendingBuffers.length > 0 || this.activeSources.size > 0
      : this.pendingBufferIds.size > 0;
  }

  private clearStartTimer() {
    if (this.startTimer) clearTimeout(this.startTimer);
    this.startTimer = null;
  }

  private finishIfDrained() {
    const hasPendingAudio = this.hasPendingAudio();
    if (this.turnComplete && this.started && !hasPendingAudio) {
      this.resetPlayback();
      this.onPlaybackComplete();
    } else if (this.turnComplete && !this.started && !hasPendingAudio) {
      this.turnComplete = false;
      this.onPlaybackComplete();
    }
  }

  private resetPlayback() {
    this.clearStartTimer();
    if (this.queue) {
      this.queue.onbufferended = null;
      this.queue.clearBuffers();
      if (this.queueHasStarted) this.queue.stop();
      this.queue.disconnect();
      this.queue = null;
    }
    for (const source of this.activeSources) {
      source.onended = null;
      source.stop();
      source.disconnect();
    }
    this.activeSources.clear();
    this.pendingBuffers.length = 0;
    this.pendingBufferIds.clear();
    this.pendingSamples = 0;
    this.nextPlaybackTime = 0;
    this.started = false;
    this.queueHasStarted = false;
    this.turnComplete = false;
    this.trailingByte = null;
  }
}
