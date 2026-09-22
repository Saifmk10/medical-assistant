// =============================================================
// components/ChatBubble.tsx — single transcript message bubble
// -------------------------------------------------------------
// Renders differently depending on ConversationMessage.role so the
// Voice Assistant screen's transcript reads like a chat conversation.
// =============================================================
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';
import type { ConversationMessage } from '../types';

export function ChatBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={isUser ? styles.textUser : styles.textAssistant}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.lg,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  textUser: {
    ...typography.body,
    color: colors.textInverse,
  },
  textAssistant: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
