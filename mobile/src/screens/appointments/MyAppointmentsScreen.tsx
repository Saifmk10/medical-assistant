// =============================================================
// screens/appointments/MyAppointmentsScreen.tsx — upcoming + past appointments
// -------------------------------------------------------------
// Implements README.md §9 "Upcoming Appointments". Tapping a card
// opens AppointmentDetailScreen where cancel/reschedule live.
// =============================================================
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppointmentCard } from '../../components/AppointmentCard';
import { EmptyState } from '../../components/EmptyState';
import { useAppointments } from '../../context/AppointmentsContext';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

export function MyAppointmentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { appointments, isLoading } = useAppointments();

  return (
    <ScreenContainer>
      <Text style={styles.title}>My Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
          >
            <AppointmentCard appointment={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="calendar-clear-outline"
              title="No appointments yet"
              subtitle="Book one from the Dashboard or the Voice Assistant."
            />
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginVertical: spacing.sm },
  list: { paddingBottom: spacing.xxl },
});
