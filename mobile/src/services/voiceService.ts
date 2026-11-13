const websocketEndpoint = 'wss://api.saifmk.online/medical-voice-api/ws';

type VoiceCallbacks = {
  onReady: () => void;
  onInputTranscript: (text: string) => void;
  onOutputTranscript: (text: string) => void;
  onAudio: (data: ArrayBuffer) => void;
  onTurnComplete: () => void;
  onInterrupted: () => void;
  onError: (message: string) => void;
};

type ServerEvent = {
  type?: string;
  text?: string;
  error?: string;
};

export class VoiceSession {
  private socket: WebSocket | null = null;
  private closed = false;

  constructor(private readonly callbacks: VoiceCallbacks) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(websocketEndpoint);
      this.socket = socket;
      socket.binaryType = 'arraybuffer';
      let didSettle = false;
      let isReady = false;
      const timeout = setTimeout(() => {
        if (didSettle) return;
        didSettle = true;
        socket.close();
        reject(new Error('Voice service connection timed out. Check your network and try again.'));
      }, 20_000);

      const settleFailure = (error: Error) => {
        if (didSettle) return;
        didSettle = true;
        clearTimeout(timeout);
        reject(error);
      };

      let messageChain = Promise.resolve();
      socket.onopen = () => {
        if (didSettle) return;
        didSettle = true;
        isReady = true;
        clearTimeout(timeout);
        this.callbacks.onReady();
        resolve();
      };

      socket.onmessage = (event) => {
        messageChain = messageChain
          .then(async () => {
            if (typeof event.data === 'string') {
              const message = JSON.parse(event.data) as ServerEvent;
              if (message.type === 'user' && message.text) {
                this.callbacks.onInputTranscript(message.text);
              } else if (message.type === 'gemini' && message.text) {
                this.callbacks.onOutputTranscript(message.text);
              } else if (message.type === 'turn_complete') {
                this.callbacks.onTurnComplete();
              } else if (message.type === 'interrupted') {
                this.callbacks.onInterrupted();
              } else if (message.type === 'error') {
                this.callbacks.onError(message.error ?? 'Voice service returned an unspecified error.');
              }
              return;
            }

            if (event.data instanceof ArrayBuffer) {
              this.callbacks.onAudio(event.data);
              return;
            }
            if (typeof Blob !== 'undefined' && event.data instanceof Blob) {
              this.callbacks.onAudio(await event.data.arrayBuffer());
              return;
            }
            throw new Error('Voice service returned an unsupported message format.');
          })
          .catch((error: unknown) => {
            const message = error instanceof Error ? error.message : 'Could not process a voice service message.';
            if (!didSettle) settleFailure(new Error(message));
            else if (isReady) this.callbacks.onError(message);
          });
      };

      socket.onerror = () => {
        const error = new Error('Voice service connection failed. Check your network and try again.');
        if (!didSettle) settleFailure(error);
        else if (isReady) this.callbacks.onError(error.message);
      };

      socket.onclose = (event) => {
        clearTimeout(timeout);
        if (this.closed) return;
        const reason = event.reason ? `: ${event.reason}` : '';
        const error = new Error(`Voice service disconnected (${event.code})${reason}. Tap the mic to reconnect.`);
        if (!didSettle) settleFailure(error);
        else if (isReady) this.callbacks.onError(error.message);
      };
    });
  }

  sendMicrophoneAudio(data: ArrayBuffer) {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send(data);
  }

  close() {
    this.closed = true;
    this.socket?.close(1000, 'User ended voice session');
    this.socket = null;
  }
}
