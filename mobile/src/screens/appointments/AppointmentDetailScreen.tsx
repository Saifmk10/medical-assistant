// =============================================================
// screens/appointments/AppointmentDetailScreen.tsx — full appointment view
// -------------------------------------------------------------
// Implements README.md §10 "Appointment Cancellation" and links into
// §11 "Appointment Rescheduling" via the Reschedule button.
// =============================================================
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { getAppointmentById } from '../../services/appointmentService';
import { useAppointments } from '../../context/AppointmentsContext';
import { colors, spacing, typography } from '../../theme';
import { formatFriendlyDate } from '../../utils/date';
import type { Appointment } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

export function AppointmentDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AppointmentDetail'>>();
  const { cancelAppointment } = useAppointments();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    getAppointmentById(route.params.appointmentId).then((a) => setAppointment(a ?? null));
  }, [route.params.appointmentId]);

  if (!appointment) return null;

  const handleCancel = () => {
    Alert.alert('Cancel appointment', `Cancel your appointment with ${appointment.doctor.name}?`, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Yes, cancel',
        style: 'destructive',
        onPress: async () => {
          setIsCancelling(true);
          try {
            await cancelAppointment(appointment.id);
            navigation.goBack();
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.headerRow}>
            <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
            <StatusBadge status={appointment.status} />
          </View>
          <Text style={styles.specialty}>{appointment.doctor.specialty} · {appointment.doctor.qualification}</Text>

          <Row icon="calendar-outline" text={`${formatFriendlyDate(appointment.date)} at ${appointment.startTime} - ${appointment.endTime}`} />
          <Row icon="location-outline" text={appointment.location} />
          {appointment.notes ? <Row icon="document-text-outline" text={appointment.notes} /> : null}
        </Card>

        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <View style={styles.actions}>
            <Button
              label="Reschedule"
              variant="secondary"
              onPress={() => navigation.navigate('RescheduleAppointment', { appointmentId: appointment.id })}
              style={styles.actionButton}
            />
            <Button
              label="Cancel Appointment"
              variant="danger"
              loading={isCancelling}
              onPress={handleCancel}
              style={styles.actionButton}
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function Row({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  doctorName: { ...typography.h3, color: colors.textPrimary },
  specialty: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  rowText: { ...typography.body, color: colors.textPrimary, marginLeft: spacing.xs, flexShrink: 1 },
  actions: { marginTop: spacing.lg },
  actionButton: { marginBottom: spacing.sm },
});
