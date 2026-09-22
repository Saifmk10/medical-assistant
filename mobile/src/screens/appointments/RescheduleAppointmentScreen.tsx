// =============================================================
// screens/appointments/RescheduleAppointmentScreen.tsx — pick a new slot
// -------------------------------------------------------------
// Implements README.md §11 "Appointment Rescheduling". Reuses the
// same slot-picking pattern as BookAppointmentScreen.
// =============================================================
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TimeSlotChip } from '../../components/TimeSlotChip';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { getAppointmentById, getAvailableSlots } from '../../services/appointmentService';
import { useAppointments } from '../../context/AppointmentsContext';
import { colors, spacing, typography } from '../../theme';
import { formatFriendlyDate } from '../../utils/date';
import type { Appointment, AppointmentSlot } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

export function RescheduleAppointmentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RescheduleAppointment'>>();
  const { rescheduleAppointment } = useAppointments();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAppointmentById(route.params.appointmentId).then(async (a) => {
      if (!a) return;
      setAppointment(a);
      const available = await getAvailableSlots(a.doctor.id);
      setSlots(available);
    });
  }, [route.params.appointmentId]);

  if (!appointment) return null;

  const handleSave = async () => {
    if (!selectedSlot) return;
    setIsSaving(true);
    try {
      await rescheduleAppointment(appointment.id, selectedSlot);
      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  const groups = slots.reduce<Record<string, AppointmentSlot[]>>((acc, slot) => {
    acc[slot.date] = acc[slot.date] ? [...acc[slot.date], slot] : [slot];
    return acc;
  }, {});

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Reschedule with {appointment.doctor.name}</Text>
        <Text style={styles.subtitle}>
          Current: {formatFriendlyDate(appointment.date)} at {appointment.startTime}
        </Text>

        {Object.keys(groups).length === 0 ? (
          <EmptyState title="No other slots available" subtitle="Please check back later." />
        ) : (
          Object.entries(groups).map(([date, daySlots]) => (
            <View key={date} style={styles.slotGroup}>
              <Text style={styles.slotGroupTitle}>{formatFriendlyDate(date)}</Text>
              <View style={styles.chipsRow}>
                {daySlots.map((slot) => (
                  <TimeSlotChip
                    key={slot.id}
                    label={slot.startTime}
                    selected={selectedSlot?.id === slot.id}
                    onPress={() => setSelectedSlot(slot)}
                  />
                ))}
              </View>
            </View>
          ))
        )}

        <Button
          label="Confirm New Time"
          onPress={handleSave}
          disabled={!selectedSlot}
          loading={isSaving}
          style={styles.saveButton}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.md },
  slotGroup: { marginTop: spacing.sm },
  slotGroupTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: spacing.xs },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  saveButton: { marginTop: spacing.lg },
});
