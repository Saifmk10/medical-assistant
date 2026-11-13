import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
} from 'expo-audio';
import type { AudioStreamBuffer } from 'expo-audio';
import { VoiceSession } from '../services/voiceService';
import { PcmAudioPlayer } from '../services/pcmAudioPlayer';
import type { ConversationMessage, VoiceAssistantState } from '../types';

interface VoiceAssistantContextValue {
  state: VoiceAssistantState;
  messages: ConversationMessage[];
  toggleListening: () => Promise<void>;
  reset: () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextValue | undefined>(undefined);

let messageId = 0;
const nextId = () => `msg-${Date.now()}-${messageId++}`;
const initialGreeting: ConversationMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi, I'm your medical assistant. How can I help you today?",
  timestamp: 0,
};

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VoiceAssistantState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([initialGreeting]);
  const session = useRef<VoiceSession | null>(null);
  const connecting = useRef(false);
  const cancelled = useRef(false);
  const activeInputId = useRef<string | null>(null);
  const activeResponseId = useRef<string | null>(null);
  const responseText = useRef('');
  const microphoneMuted = useRef(false);
  const microphoneHandler = useRef<(buffer: AudioStreamBuffer) => void>(() => {});
  const audioPlayer = useRef<PcmAudioPlayer | null>(null);
  const { stream: microphoneStream } = useAudioStream({
    sampleRate: 16_000,
    channels: 1,
    encoding: 'int16',
    onBuffer: (buffer) => microphoneHandler.current(buffer),
  });

  const stopReplyAudio = useCallback(() => {
    void audioPlayer.current?.close().catch((error: unknown) => {
      console.error('Could not stop voice response audio:', error);
    });
    audioPlayer.current = null;
  }, []);

  const toggleListening = useCallback(async () => {
    if (session.current || connecting.current) {
      cancelled.current = true;
      session.current?.close();
      session.current = null;
      stopReplyAudio();
      microphoneMuted.current = false;
      activeInputId.current = null;
      activeResponseId.current = null;
      responseText.current = '';
      microphoneStream.stop();
      setState('idle');
      return;
    }

    connecting.current = true;
    cancelled.current = false;
    activeInputId.current = null;
    activeResponseId.current = null;
    responseText.current = '';
    setState('processing');

    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) throw new Error('Microphone permission is required for voice chat.');
      if (cancelled.current) return;

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
      });

      const playback = new PcmAudioPlayer(
        () => setState('responding'),
        () => {
          microphoneMuted.current = false;
          if (session.current) setState('listening');
        },
      );
      audioPlayer.current = playback;
      await playback.resume();
      if (cancelled.current) {
        await playback.close();
        audioPlayer.current = null;
        return;
      }

      const liveSession = new VoiceSession({
        onReady: () => {
          if (!cancelled.current) setState('listening');
        },
        onInputTranscript: (text) => {
          const id = activeInputId.current ?? nextId();
          activeInputId.current = id;
          setMessages((previous) => {
            const existing = previous.findIndex((message) => message.id === id);
            const transcript: ConversationMessage = {
              id,
              role: 'user',
              text,
              timestamp: Date.now(),
            };
            if (existing < 0) return [...previous, transcript];
            return previous.map((message, index) => index === existing ? transcript : message);
          });
          activeInputId.current = null;
          setState('processing');
        },
        onOutputTranscript: (text) => {
          microphoneMuted.current = true;
          activeResponseId.current ??= nextId();
          responseText.current += text;
          const id = activeResponseId.current;
          setMessages((previous) => {
            const existing = previous.findIndex((message) => message.id === id);
            const response: ConversationMessage = {
              id,
              role: 'assistant',
              text: responseText.current,
              timestamp: Date.now(),
            };
            if (existing < 0) return [...previous, response];
            return previous.map((message, index) => index === existing ? response : message);
          });
          setState('responding');
        },
        onTurnComplete: () => {
          responseText.current = '';
          activeResponseId.current = null;
          try {
            playback.finishTurn();
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Could not finish voice response audio.';
            setMessages((previous) => [...previous, {
              id: nextId(),
              role: 'assistant',
              text: message,
              timestamp: Date.now(),
            }]);
            stopReplyAudio();
            microphoneMuted.current = false;
            if (session.current) setState('listening');
          }
        },
        onAudio: (data) => {
          try {
            microphoneMuted.current = true;
            playback.enqueue(data);
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Could not process voice response audio.';
            setMessages((previous) => [...previous, {
              id: nextId(),
              role: 'assistant',
              text: message,
              timestamp: Date.now(),
            }]);
            stopReplyAudio();
            microphoneMuted.current = false;
            if (session.current) setState('listening');
          }
        },
        onInterrupted: () => {
          playback.interrupt();
          microphoneMuted.current = false;
          activeResponseId.current = null;
          responseText.current = '';
          setState('listening');
        },
        onError: (message) => {
          liveSession.close();
          if (session.current === liveSession) session.current = null;
          stopReplyAudio();
          microphoneMuted.current = false;
          activeInputId.current = null;
          activeResponseId.current = null;
          responseText.current = '';
          microphoneStream.stop();
          setMessages((previous) => [...previous, {
            id: nextId(),
            role: 'assistant',
            text: message,
            timestamp: Date.now(),
          }]);
          setState('idle');
        },
      });
      session.current = liveSession;
      await liveSession.connect();
      if (cancelled.current) {
        liveSession.close();
        session.current = null;
        return;
      }
      await microphoneStream.start();
      if (cancelled.current) {
        liveSession.close();
        session.current = null;
        microphoneStream.stop();
        return;
      }
      setState('listening');
    } catch (error) {
      session.current?.close();
      session.current = null;
      microphoneMuted.current = false;
      microphoneStream.stop();
      activeInputId.current = null;
      activeResponseId.current = null;
      responseText.current = '';
      if (!cancelled.current) {
        const message = error instanceof Error ? error.message : 'Could not start voice chat.';
        setMessages((previous) => [...previous, {
          id: nextId(),
          role: 'assistant',
          text: message,
          timestamp: Date.now(),
        }]);
        setState('idle');
      }
    } finally {
      connecting.current = false;
    }
  }, [microphoneStream, stopReplyAudio]);

  const reset = useCallback(() => {
    cancelled.current = true;
    session.current?.close();
    session.current = null;
    stopReplyAudio();
    microphoneStream.stop();
    activeInputId.current = null;
    activeResponseId.current = null;
    responseText.current = '';
    setState('idle');
    setMessages([
      {
        id: nextId(),
        role: 'assistant',
        text: "Hi, I'm your medical assistant. How can I help you today?",
        timestamp: Date.now(),
      },
    ]);
  }, [microphoneStream, stopReplyAudio]);

  useEffect(() => () => {
    cancelled.current = true;
    session.current?.close();
    session.current = null;
    microphoneMuted.current = false;
    microphoneStream.stop();
    stopReplyAudio();
  }, [microphoneStream, stopReplyAudio]);

  useEffect(() => {
    microphoneHandler.current = (buffer) => {
      if (microphoneMuted.current) return;
      session.current?.sendMicrophoneAudio(buffer.data);
    };
  }, []);

  return (
    <VoiceAssistantContext.Provider value={{ state, messages, toggleListening, reset }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const ctx = useContext(VoiceAssistantContext);
  if (!ctx) throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  return ctx;
}
