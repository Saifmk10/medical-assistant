import { GeminiLiveAudio } from '../../modules/gemini-live-audio/src';

const liveModel = 'gemini-3.8-live';
const websocketEndpoint =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

type LiveCallbacks = {
  onReady: () => void;
  onInputTranscript: (text: string, isFinal: boolean) => void;
  onOutputTranscript: (text: string) => void;
  onTurnComplete: () => void;
  onAudioStart: () => void;
  onInterrupted: () => void;
  onError: (message: string) => void;
};

type LiveServerMessage = {
  setupComplete?: object;
  error?: { message?: string; code?: number };
  serverContent?: {
    turnComplete?: boolean;
    interrupted?: boolean;
    modelTurn?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] };
    inputTranscription?: { text?: string };
    interimInputTranscription?: { text?: string };
    outputTranscription?: { text?: string };
  };
};

function encodeBase64(bytes: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let encoded = '';

  for (let offset = 0; offset < bytes.length; offset += 3) {
    const first = bytes[offset];
    const hasSecond = offset + 1 < bytes.length;
    const hasThird = offset + 2 < bytes.length;
    const second = hasSecond ? bytes[offset + 1] : 0;
    const third = hasThird ? bytes[offset + 2] : 0;

    encoded += alphabet[first >> 2];
    encoded += alphabet[((first & 3) << 4) | (second >> 4)];
    encoded += hasSecond ? alphabet[((second & 15) << 2) | (third >> 6)] : '=';
    encoded += hasThird ? alphabet[third & 63] : '=';
  }

  return encoded;
}

async function decodeSocketMessage(data: unknown): Promise<string> {
  if (typeof data === 'string') return data;
  if (typeof Blob !== 'undefined' && data instanceof Blob) return data.text();
  if (data instanceof ArrayBuffer) return new TextDecoder().decode(data);
  throw new Error('Unsupported Gemini Live message format.');
}

export class GeminiLiveSession {
  private socket: WebSocket | null = null;
  private closed = false;
  private playbackStarted = false;
  private playing: Promise<void> = Promise.resolve();

  constructor(private readonly callbacks: LiveCallbacks) {}

  connect(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(`${websocketEndpoint}?key=${encodeURIComponent(apiKey)}`);
      this.socket = socket;
      let didSettle = false;
      let isReady = false;
      const timeout = setTimeout(() => {
        if (didSettle) return;
        didSettle = true;
        socket.close();
        reject(new Error('Gemini Live connection timed out. Check network and Live API access.'));
      }, 20_000);

      const settleFailure = (error: Error) => {
        if (didSettle) return;
        didSettle = true;
        clearTimeout(timeout);
        reject(error);
      };

      let messageChain = Promise.resolve();
      socket.onopen = () => {
        try {
          socket.send(JSON.stringify({
            setup: {
              model: `models/${liveModel}`,
              generationConfig: { responseModalities: ['AUDIO'] },
              systemInstruction: {
                parts: [{
                  text: 'You are the medical assistant in a patient-facing app. Answer medical and appointment-related questions clearly and concisely. Provide general information, not a diagnosis or a substitute for a clinician. For urgent or emergency symptoms, tell the user to seek local emergency care. Do not claim to book, cancel, or change an appointment; this app has not connected those actions yet.',
                }],
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
            },
          }));
        } catch (error) {
          settleFailure(error instanceof Error ? error : new Error('Could not send Gemini Live setup.'));
        }
      };

      socket.onmessage = (event) => {
        messageChain = messageChain
          .then(() => decodeSocketMessage(event.data))
          .then((raw) => {
            const message = JSON.parse(raw) as LiveServerMessage;

            if (message.error) {
              const description = message.error.message ?? `Gemini Live error ${message.error.code ?? ''}`.trim();
              if (!didSettle) settleFailure(new Error(description));
              else if (isReady) this.callbacks.onError(description);
              return;
            }

            if (message.setupComplete) {
              if (!didSettle) {
                didSettle = true;
                isReady = true;
                clearTimeout(timeout);
                GeminiLiveAudio.start(24000).then(() => { this.playbackStarted = true; }).catch(() => undefined);
                this.callbacks.onReady();
                resolve();
              }
              return;
            }

            const content = message.serverContent;
            if (!content) return;
            if (content.interrupted) {
              GeminiLiveAudio.flush();
              this.callbacks.onInterrupted();
            }
            for (const part of content.modelTurn?.parts ?? []) {
              const audio = part.inlineData;
              if (audio?.data && audio.mimeType?.startsWith('audio/pcm') && this.playbackStarted) {
                this.callbacks.onAudioStart();
                const chunk = audio.data;
                this.playing = this.playing.then(() => GeminiLiveAudio.writeBase64(chunk)).catch(() => undefined);
              }
            }
            if (content.interimInputTranscription?.text) {
              this.callbacks.onInputTranscript(content.interimInputTranscription.text, false);
            }
            if (content.inputTranscription?.text) {
              this.callbacks.onInputTranscript(content.inputTranscription.text, true);
            }
            if (content.outputTranscription?.text) {
              this.callbacks.onOutputTranscript(content.outputTranscription.text);
            }
            if (content.turnComplete) this.callbacks.onTurnComplete();
          })
          .catch((error: unknown) => {
            const messageText = error instanceof Error ? error.message : 'Could not decode a Gemini Live message.';
            if (!didSettle) settleFailure(new Error(messageText));
            else if (isReady) this.callbacks.onError(messageText);
          });
      };

      socket.onerror = () => {
        const error = new Error('Gemini Live connection failed. Check the API key, Live model access, and network.');
        if (!didSettle) settleFailure(error);
        else if (isReady) this.callbacks.onError(error.message);
      };

      socket.onclose = (event) => {
        clearTimeout(timeout);
        if (this.closed || event.code === 1000) return;
        const reason = event.reason ? `: ${event.reason}` : '';
        const error = new Error(`Gemini Live disconnected (${event.code})${reason}. Tap the mic to reconnect.`);
        if (!didSettle) settleFailure(error);
        else if (isReady) this.callbacks.onError(error.message);
      };
    });
  }

  sendMicrophoneAudio(data: ArrayBuffer, sampleRate: number) {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({
      realtimeInput: {
        audio: {
          data: encodeBase64(new Uint8Array(data)),
          mimeType: `audio/pcm;rate=${sampleRate}`,
        },
      },
    }));
  }

  close() {
    this.closed = true;
    this.playbackStarted = false;
    GeminiLiveAudio.stop();
    this.socket?.close(1000, 'User ended voice session');
    this.socket = null;
  }
}
