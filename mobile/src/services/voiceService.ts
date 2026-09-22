// =============================================================
// services/voiceService.ts — speech + conversation integration point
// -------------------------------------------------------------
// This is a STUB. The project already has a voice backend under
// /voice_modules (gemini_live.py, voice_assistant.py, twilio_handler.py)
// which is expected to be exposed over WebSocket/HTTP for real-time
// speech-to-text, intent understanding and text-to-speech.
//
// TO CONNECT THE REAL BACKEND:
//   - Replace `simulateTranscription` with a real microphone capture
//     (e.g. `expo-av` Audio.Recording) streamed to the voice backend.
//   - Replace `simulateAssistantReply` with the actual response coming
//     back from /voice_modules (likely over a WebSocket connection —
//     see gemini_live.py for the expected message protocol).
//   - Replace `speak()` with real TTS audio playback of the backend's
//     audio response (or `expo-speech` as a fallback).
// Until then, the Voice Assistant screen uses these simulated calls so
// the full conversational UI/UX can be built and demoed end-to-end.
// =============================================================

/** Simulates converting captured speech into text. */
export async function simulateTranscription(promptHint?: string): Promise<string> {
  await delay(900);
  return promptHint ?? "I'd like to book a dermatology appointment tomorrow evening.";
}

/** Simulates the assistant "thinking" and generating a reply for a user utterance. */
export async function simulateAssistantReply(userText: string): Promise<string> {
  await delay(1100);
  const text = userText.toLowerCase();
  if (text.includes('dermat') || text.includes('skin')) {
    return 'I found two available dermatology appointments tomorrow evening — 5:30 PM and 7:00 PM. Which would you prefer?';
  }
  if (text.includes('cancel')) {
    return 'I found your upcoming appointment. Would you like me to cancel it?';
  }
  if (text.includes('resched') || text.includes('move')) {
    return 'Your doctor has availability on Friday at 5:00 PM and 6:30 PM. Which would you prefer?';
  }
  return "I can help you find a suitable doctor. Would you like an appointment today or tomorrow?";
}

/** Simulates speaking the assistant's reply aloud (replace with expo-speech / real TTS audio). */
export async function speak(_text: string): Promise<void> {
  await delay(600);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
