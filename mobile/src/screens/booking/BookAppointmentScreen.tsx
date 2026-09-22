// =============================================================
// screens/booking/BookAppointmentScreen.tsx — find doctor → pick slot → confirm
// -------------------------------------------------------------
// Implements README.md §8 "Appointment Booking" as a 3-step wizard:
//   1. Choose/search a doctor (services/doctorService.ts)
//   2. Choose an available slot (services/appointmentService.ts)
//   3. Confirm and book (context/AppointmentsContext.tsx)
// =============================================================
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { DoctorCard } from '../../components/DoctorCard';
import { TimeSlotChip } from '../../components/TimeSlotChip';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { getDoctors } from '../../services/doctorService';
import { getAvailableSlots } from '../../services/appointmentService';
import { useAppointments } from '../../context/AppointmentsContext';
import { colors, spacing, typography } from '../../theme';
import { formatFriendlyDate } from '../../utils/date';
import type { Doctor, AppointmentSlot } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

type Step = 'doctor' | 'slot' | 'confirm';

export function BookAppointmentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookAppointment } = useAppointments();

  const [step, setStep] = useState<Step>('doctor');
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) || doctor.specialty.toLowerCase().includes(query)
    );
  });

  const handleSelectDoctor = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    const available = await getAvailableSlots(doctor.id);
    setSlots(available);
    setStep('slot');
  };

  const handleSelectSlot = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedSlot) return;
    setIsBooking(true);
    try {
      await bookAppointment({
        id: `appt-${Date.now()}`,
        doctor: selectedDoctor,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        location: `${selectedDoctor.clinic} — ${selectedDoctor.location}`,
        status: 'confirmed',
      });
      navigation.goBack();
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {step === 'doctor' && (
          <>
            <Text style={styles.stepTitle}>Find a doctor</Text>
            <TextInput
              style={styles.search}
              placeholder="Search by name or specialty (e.g. Dermatology)"
              placeholderTextColor={colors.textTertiary}
              value={search}
              onChangeText={setSearch}
            />
            {filteredDoctors.length === 0 ? (
              <EmptyState title="No matching doctors" subtitle="Try a different name or specialty." />
            ) : (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onPress={() => handleSelectDoctor(doctor)} />
              ))
            )}
          </>
        )}

        {step === 'slot' && selectedDoctor && (
          <>
            <Text style={styles.stepTitle}>Choose a time</Text>
            <DoctorCard doctor={selectedDoctor} />
            {slots.length === 0 ? (
              <EmptyState title="No available slots" subtitle="Try a different doctor." />
            ) : (
              Object.entries(groupByDate(slots)).map(([date, daySlots]) => (
                <View key={date} style={styles.slotGroup}>
                  <Text style={styles.slotGroupTitle}>{formatFriendlyDate(date)}</Text>
                  <View style={styles.chipsRow}>
                    {daySlots.map((slot) => (
                      <TimeSlotChip
                        key={slot.id}
                        label={slot.startTime}
                        selected={selectedSlot?.id === slot.id}
                        onPress={() => handleSelectSlot(slot)}
                      />
                    ))}
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {step === 'confirm' && selectedDoctor && selectedSlot && (
          <>
            <Text style={styles.stepTitle}>Confirm appointment</Text>
            <Card>
              <Text style={styles.confirmLabel}>Doctor</Text>
              <Text style={styles.confirmValue}>{selectedDoctor.name} · {selectedDoctor.specialty}</Text>
              <Text style={styles.confirmLabel}>Date & time</Text>
              <Text style={styles.confirmValue}>
                {formatFriendlyDate(selectedSlot.date)} at {selectedSlot.startTime}
              </Text>
              <Text style={styles.confirmLabel}>Location</Text>
              <Text style={styles.confirmValue}>{selectedDoctor.clinic} — {selectedDoctor.location}</Text>
            </Card>
            <Button label="Confirm & Book" onPress={handleConfirm} loading={isBooking} style={styles.confirmButton} />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function groupByDate(slots: AppointmentSlot[]): Record<string, AppointmentSlot[]> {
  return slots.reduce<Record<string, AppointmentSlot[]>>((acc, slot) => {
    acc[slot.date] = acc[slot.date] ? [...acc[slot.date], slot] : [slot];
    return acc;
  }, {});
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing.xxl, paddingTop: spacing.sm },
  stepTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  search: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  slotGroup: { marginTop: spacing.sm },
  slotGroupTitle: { ...typography.bodyMedium, color: colors.textPrimary, marginBottom: spacing.xs },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  confirmLabel: { ...typography.label, color: colors.textTertiary, marginTop: spacing.sm },
  confirmValue: { ...typography.bodyLarge, color: colors.textPrimary, marginTop: 2 },
  confirmButton: { marginTop: spacing.lg },
});
