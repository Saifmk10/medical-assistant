import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, typography } from '../../theme';

export function MedicalHistoryScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Medical History</Text>
      <EmptyState
        icon="document-text-outline"
        title="Medical history unavailable"
        subtitle="Your medical history is not available in the app yet."
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginVertical: spacing.sm },
});
