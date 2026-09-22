// =============================================================
// components/AppointmentCard.tsx — upcoming/past appointment summary
// -------------------------------------------------------------
// Used on the Dashboard and My Appointments screen. Optional action
// buttons (Reschedule/Cancel) are only shown when handlers are passed
// in, so the same component works for read-only history views too.
// =============================================================
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme';
import type { Appointment } from '../types';
import { formatFriendlyDate } from '../utils/date';

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export function AppointmentCard({ appointment, onReschedule, onCancel }: AppointmentCardProps) {
  const { doctor } = appointment;
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <StatusBadge status={appointment.status} />
      </View>
      <Text style={styles.specialty}>{doctor.specialty}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.metaText}>{formatFriendlyDate(appointment.date)} · {appointment.startTime}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.metaText} numberOfLines={1}>{appointment.location}</Text>
      </View>

      {(onReschedule || onCancel) && (
        <View style={styles.actionsRow}>
          {onReschedule ? (
            <Button label="Reschedule" variant="secondary" onPress={onReschedule} style={styles.actionButton} />
          ) : null}
          {onCancel ? (
            <Button label="Cancel" variant="ghost" onPress={onCancel} style={styles.actionButton} />
          ) : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flexShrink: 1,
    marginRight: spacing.xs,
  },
  specialty: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xxs,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginRight: spacing.xs,
    paddingVertical: spacing.xs,
    minHeight: 40,
  },
});
