import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
} from 'expo-audio';
import type { AudioStreamBuffer } from 'expo-audio';
import { VoiceSession } from '../services/voiceService';
import { PcmAudioPlayer } from '../services/pcmAudioPlayer';
import { useAuth } from './AuthContext';
import type { ConversationMessage, VoiceAssistantState } from '../types';

interface VoiceAssistantContextValue {
  state: VoiceAssistantState;
  messages: ConversationMessage[];
  /** Live microphone volume, 0 (silent) – 1 (loud), for driving the speaking animation. */
  inputLevel: Animated.Value;
  /** Live assistant-reply volume, 0 (silent) – 1 (loud), for driving the speaking animation. */
  outputLevel: Animated.Value;
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

/** Approximate RMS loudness of a little-endian int16 PCM buffer, normalized to roughly 0-1. */
function pcmLevel(data: ArrayBuffer): number {
  const sampleCount = Math.floor(data.byteLength / 2);
  if (sampleCount === 0) return 0;
  const view = new DataView(data);
  const step = Math.max(1, Math.floor(sampleCount / 256));
  let sumSquares = 0;
  let counted = 0;
  for (let index = 0; index < sampleCount; index += step) {
    const sample = view.getInt16(index * 2, true) / 32_768;
    sumSquares += sample * sample;
    counted++;
  }
  const rms = Math.sqrt(sumSquares / counted);
  return Math.min(1, rms * 4.5);
}

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const { patient } = useAuth();
  const [state, setState] = useState<VoiceAssistantState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([initialGreeting]);
  const session = useRef<VoiceSession | null>(null);
  const connecting = useRef(false);
  const cancelled = useRef(false);
  const mounted = useRef(true);
  const activeInputId = useRef<string | null>(null);
  const activeResponseId = useRef<string | null>(null);
  const responseText = useRef('');
  const microphoneMuted = useRef(false);
  const postReplyDiagnostics = useRef({ pending: false, loggedBuffer: false, loggedSound: false });
  const inputText = useRef('');
  const microphoneHandler = useRef<(buffer: AudioStreamBuffer) => void>(() => {});
  const audioPlayer = useRef<PcmAudioPlayer | null>(null);
  const [inputLevel] = useState(() => new Animated.Value(0));
  const [outputLevel] = useState(() => new Animated.Value(0));
  const { stream: microphoneStream } = useAudioStream({
    sampleRate: 16_000,
    channels: 1,
    encoding: 'int16',
    onBuffer: (buffer) => microphoneHandler.current(buffer),
  });

  const resetLevels = useCallback(() => {
    inputLevel.stopAnimation();
    outputLevel.stopAnimation();
    inputLevel.setValue(0);
    outputLevel.setValue(0);
  }, [inputLevel, outputLevel]);

  const animateLevel = useCallback((level: Animated.Value, value: number) => {
    Animated.timing(level, { toValue: value, duration: 100, easing: Easing.linear, useNativeDriver: true }).start();
  }, []);

  const stopReplyAudio = useCallback(() => {
    void audioPlayer.current?.close().catch((error: unknown) => {
      console.error('Could not stop voice response audio:', error);
    });
    audioPlayer.current = null;
  }, []);

  // Drop microphone audio while the assistant's reply is playing to avoid speaker feedback.
  const holdMicrophone = useCallback(() => {
    microphoneMuted.current = true;
  }, []);

  const releaseMicrophone = useCallback(() => {
    microphoneMuted.current = false;
  }, []);

  const startNewInputTurn = useCallback(() => {
    activeInputId.current = null;
    inputText.current = '';
  }, []);

  const toggleListening = useCallback(async () => {
    postReplyDiagnostics.current.pending = false;
    if (session.current || connecting.current) {
      cancelled.current = true;
      session.current?.close();
      session.current = null;
      stopReplyAudio();
      releaseMicrophone();
      startNewInputTurn();
      activeResponseId.current = null;
      responseText.current = '';
      microphoneStream.stop();
      resetLevels();
      setState('idle');
      return;
    }

    if (!patient?.id) {
      setMessages((previous) => [...previous, {
        id: nextId(),
        role: 'assistant',
        text: 'Sign in before starting voice chat.',
        timestamp: Date.now(),
      }]);
      return;
    }

    connecting.current = true;
    cancelled.current = false;
    startNewInputTurn();
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
        () => {
          holdMicrophone();
          setState('responding');
        },
        () => {
          releaseMicrophone();
          outputLevel.setValue(0);
          if (session.current) {
            if (__DEV__) {
              postReplyDiagnostics.current = { pending: true, loggedBuffer: false, loggedSound: false };
              console.log('[voice] reply playback complete');
            }
            setState('listening');
          }
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
          if (__DEV__ && postReplyDiagnostics.current.pending) {
            console.log('[voice] server received speech after reply');
            postReplyDiagnostics.current.pending = false;
          }
          // Transcripts arrive in small fragments (many more for mixed-language speech), so grow one message per turn.
          const id = activeInputId.current ?? nextId();
          activeInputId.current = id;
          inputText.current += text;
          const transcriptText = inputText.current;
          setMessages((previous) => {
            const existing = previous.findIndex((message) => message.id === id);
            const transcript: ConversationMessage = {
              id,
              role: 'user',
              text: transcriptText,
              timestamp: Date.now(),
            };
            if (existing < 0) return [...previous, transcript];
            return previous.map((message, index) => index === existing ? transcript : message);
          });
        },
        onOutputTranscript: (text) => {
          startNewInputTurn();
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
        },
        onTurnComplete: () => {
          responseText.current = '';
          activeResponseId.current = null;
          startNewInputTurn();
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
            releaseMicrophone();
            outputLevel.setValue(0);
            if (session.current) setState('listening');
          }
        },
        onAudio: (data) => {
          try {
            holdMicrophone();
            startNewInputTurn();
            animateLevel(outputLevel, pcmLevel(data));
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
            releaseMicrophone();
            outputLevel.setValue(0);
            if (session.current) setState('listening');
          }
        },
        onInterrupted: () => {
          if (__DEV__) console.log('[voice] server interrupted the reply; microphone muted =', microphoneMuted.current);
          playback.interrupt();
          releaseMicrophone();
          startNewInputTurn();
          activeResponseId.current = null;
          responseText.current = '';
          outputLevel.setValue(0);
          setState('listening');
        },
        onError: (message) => {
          if (!mounted.current) return;
          liveSession.close();
          if (session.current === liveSession) session.current = null;
          stopReplyAudio();
          releaseMicrophone();
          startNewInputTurn();
          activeResponseId.current = null;
          responseText.current = '';
          microphoneStream.stop();
          resetLevels();
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
      await liveSession.connect(patient.id);
      if (cancelled.current) {
        liveSession.close();
        session.current = null;
        return;
      }
      await microphoneStream.start();
      if (cancelled.current) {
        liveSession.close();
        session.current = null;
        if (mounted.current) microphoneStream.stop();
        return;
      }
      setState('listening');
    } catch (error) {
      session.current?.close();
      session.current = null;
      releaseMicrophone();
      if (mounted.current) microphoneStream.stop();
      stopReplyAudio();
      startNewInputTurn();
      activeResponseId.current = null;
      responseText.current = '';
      resetLevels();
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
  }, [animateLevel, holdMicrophone, microphoneStream, outputLevel, releaseMicrophone, resetLevels, startNewInputTurn, stopReplyAudio]);

  const reset = useCallback(() => {
    cancelled.current = true;
    session.current?.close();
    session.current = null;
    stopReplyAudio();
    releaseMicrophone();
    microphoneStream.stop();
    startNewInputTurn();
    activeResponseId.current = null;
    responseText.current = '';
    resetLevels();
    setState('idle');
    setMessages([
      {
        id: nextId(),
        role: 'assistant',
        text: "Hi, I'm your medical assistant. How can I help you today?",
        timestamp: Date.now(),
      },
    ]);
  }, [microphoneStream, releaseMicrophone, resetLevels, startNewInputTurn, stopReplyAudio]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancelled.current = true;
      session.current?.close();
      session.current = null;
      releaseMicrophone();
      stopReplyAudio();
    };
  }, [microphoneStream, releaseMicrophone, stopReplyAudio]);

  useEffect(() => {
    microphoneHandler.current = (buffer) => {
      if (microphoneMuted.current) {
        inputLevel.setValue(0);
        return;
      }
      const level = pcmLevel(buffer.data);
      animateLevel(inputLevel, level);
      const sent = session.current?.sendMicrophoneAudio(buffer.data) ?? false;
      if (__DEV__ && postReplyDiagnostics.current.pending && !postReplyDiagnostics.current.loggedBuffer) {
        postReplyDiagnostics.current.loggedBuffer = true;
        console.log('[voice] microphone buffer after reply:', {
          sent,
          sampleRate: buffer.sampleRate,
          channels: buffer.channels,
          streaming: microphoneStream.isStreaming,
        });
      }
      if (__DEV__ && postReplyDiagnostics.current.pending && !postReplyDiagnostics.current.loggedSound && level > 0.02) {
        postReplyDiagnostics.current.loggedSound = true;
        console.log('[voice] microphone detected sound after reply; sent =', sent);
      }
    };
  }, [animateLevel, inputLevel, microphoneStream]);

  return (
    <VoiceAssistantContext.Provider value={{ state, messages, inputLevel, outputLevel, toggleListening, reset }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const ctx = useContext(VoiceAssistantContext);
  if (!ctx) throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  return ctx;
}
