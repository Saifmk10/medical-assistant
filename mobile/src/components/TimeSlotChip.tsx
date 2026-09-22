// =============================================================
// components/TimeSlotChip.tsx — selectable appointment time chip
// -------------------------------------------------------------
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

interface TimeSlotChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function TimeSlotChip({ label, selected = false, onPress }: TimeSlotChipProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected }}
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.textInverse,
  },
});
