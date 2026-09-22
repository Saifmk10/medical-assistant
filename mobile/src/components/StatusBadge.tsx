// =============================================================
// components/StatusBadge.tsx — small pill showing appointment status
// -------------------------------------------------------------
// Color driven entirely by theme/colors.ts::colors.status so adding
// a new AppointmentStatus only requires updating the theme + the
// `statusLabels` map below.
// =============================================================
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';
import type { AppointmentStatus } from '../types';

const statusLabels: Record<AppointmentStatus, string> = {
  available: 'Available',
  booked: 'Booked',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  completed: 'Completed',
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const color = colors.status[status];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: `${color}40` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{statusLabels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xxs,
  },
  label: {
    ...typography.label,
  },
});
