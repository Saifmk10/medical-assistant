// =============================================================
// context/VoiceAssistantContext.tsx — conversation + mic state machine
// -------------------------------------------------------------
// Owns the Voice Assistant screen's state: the transcript, and the
// idle → listening → processing → responding cycle.
//
// TO CONNECT THE REAL BACKEND:
//   Replace the calls to services/voiceService.ts's simulated
//   functions with real microphone capture + streaming to
//   /voice_modules (gemini_live.py). Keep the same state transitions
//   so the UI (MicButton, ChatBubble transcript) needs no changes.
// =============================================================
import React, { createContext, useCallback, useContext, useState } from 'react';
import { simulateAssistantReply, simulateTranscription, speak } from '../services/voiceService';
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

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VoiceAssistantState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: nextId(),
      role: 'assistant',
      text: "Hi, I'm your medical assistant. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);

  const toggleListening = useCallback(async () => {
    if (state === 'listening' || state === 'processing' || state === 'responding') {
      // Already mid-turn — ignore extra taps until the current turn settles.
      return;
    }

    setState('listening');
    const userText = await simulateTranscription();
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: userText, timestamp: Date.now() }]);

    setState('processing');
    const assistantText = await simulateAssistantReply(userText);

    setState('responding');
    setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: assistantText, timestamp: Date.now() }]);
    await speak(assistantText);

    setState('idle');
  }, [state]);

  const reset = useCallback(() => {
    setState('idle');
    setMessages([
      {
        id: nextId(),
        role: 'assistant',
        text: "Hi, I'm your medical assistant. How can I help you today?",
        timestamp: Date.now(),
      },
    ]);
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
