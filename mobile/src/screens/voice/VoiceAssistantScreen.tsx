// =============================================================
// screens/voice/VoiceAssistantScreen.tsx — primary conversational UI
// -------------------------------------------------------------
// See README.md §17 "Voice Assistant Screen". Displays the mic
// button, current state label and the running transcript. All state
// is owned by context/VoiceAssistantContext.tsx.
// =============================================================
import React, { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ChatBubble } from '../../components/ChatBubble';
import { MicButton } from '../../components/MicButton';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { colors, spacing, typography } from '../../theme';
import type { VoiceAssistantState } from '../../types';

const STATE_LABEL: Record<VoiceAssistantState, string> = {
  idle: 'Tap the mic and tell me what you need',
  listening: 'Listening…',
  processing: 'Understanding your request…',
  responding: 'Here you go',
};

export function VoiceAssistantScreen() {
  const { state, messages, toggleListening } = useVoiceAssistant();
  const listRef = useRef<FlatList>(null);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Assistant</Text>
        <Text style={styles.subtitle}>Say what you need — I'll take care of the rest</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.transcript}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.controls}>
        <Text style={styles.stateLabel}>{STATE_LABEL[state]}</Text>
        <MicButton state={state} onPress={toggleListening} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.sm, paddingBottom: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  transcript: { paddingVertical: spacing.md, flexGrow: 1, justifyContent: 'flex-end' },
  controls: { alignItems: 'center', paddingBottom: spacing.xl, paddingTop: spacing.sm },
  stateLabel: { ...typography.bodyMedium, color: colors.textSecondary, marginBottom: spacing.md },
});
