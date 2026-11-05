import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
} from 'expo-audio';
import type { AudioStreamBuffer } from 'expo-audio';
import { GeminiLiveSession } from '../services/voiceService';
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
  const session = useRef<GeminiLiveSession | null>(null);
  const connecting = useRef(false);
  const cancelled = useRef(false);
  const activeInputId = useRef<string | null>(null);
  const activeResponseId = useRef<string | null>(null);
  const responseText = useRef('');
  const microphoneMuted = useRef(false);
  const unmuteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const microphoneHandler = useRef<(buffer: AudioStreamBuffer) => void>(() => {});
  const { stream: microphoneStream } = useAudioStream({
    sampleRate: 16_000,
    channels: 1,
    encoding: 'int16',
    onBuffer: (buffer) => microphoneHandler.current(buffer),
  });

  const toggleListening = useCallback(async () => {
    if (session.current || connecting.current) {
      cancelled.current = true;
      session.current?.close();
      session.current = null;
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
      const apiKey = Constants.expoConfig?.extra?.geminiApiKey;
      if (typeof apiKey !== 'string' || !apiKey.trim()) {
        throw new Error('GEMINI_API_KEY is missing from the repository root .env file.');
      }

      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) throw new Error('Microphone permission is required for voice chat.');
      if (cancelled.current) return;

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
      });

      const liveSession = new GeminiLiveSession({
        onReady: () => setState('listening'),
        onInputTranscript: (text, isFinal) => {
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
          if (isFinal) {
            activeInputId.current = null;
            setState('processing');
          }
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
          // Keep the mic muted briefly so buffered speech isn't picked up as input.
          unmuteTimer.current = setTimeout(() => {
            microphoneMuted.current = false;
            if (session.current) setState('listening');
          }, 500);
        },
        onAudioStart: () => {
          if (unmuteTimer.current) clearTimeout(unmuteTimer.current);
          unmuteTimer.current = null;
          microphoneMuted.current = true;
          setState('responding');
        },
        onInterrupted: () => {
          microphoneMuted.current = false;
          activeResponseId.current = null;
          responseText.current = '';
          setState('listening');
        },
        onError: (message) => {
          liveSession.close();
          if (session.current === liveSession) session.current = null;
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
      await liveSession.connect(apiKey);
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
        const message = error instanceof Error ? error.message : 'Could not start Gemini Live voice chat.';
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
  }, [microphoneStream]);

  const reset = useCallback(() => {
    cancelled.current = true;
    session.current?.close();
    session.current = null;
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
  }, [microphoneStream]);

  useEffect(() => () => {
    cancelled.current = true;
    session.current?.close();
    microphoneMuted.current = false;
    microphoneStream.stop();
    if (unmuteTimer.current) clearTimeout(unmuteTimer.current);
  }, [microphoneStream]);

  useEffect(() => {
    microphoneHandler.current = (buffer) => {
      if (microphoneMuted.current) return;
      session.current?.sendMicrophoneAudio(buffer.data, buffer.sampleRate);
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
