// =============================================================
// screens/home/DashboardScreen.tsx — patient home screen
// -------------------------------------------------------------
// Shows the next upcoming appointment + quick actions, matching
// README.md §16 "Patient Dashboard".
// =============================================================
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { AppointmentCard } from '../../components/AppointmentCard';
import { EmptyState } from '../../components/EmptyState';
import { Card } from '../../components/Card';
import { DashboardHeader } from './DashboardHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

const QUICK_ACTIONS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; route: keyof RootStackParamList }[] = [
  { key: 'book', label: 'Book\nAppointment', icon: 'add-circle-outline', route: 'BookAppointment' },
  { key: 'assistant', label: 'Voice\nAssistant', icon: 'mic-outline', route: 'MainTabs' },
];

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { patient } = useAuth();
  const { appointments } = useAppointments();

  const nextAppointment = appointments[0];

  return (
    <ScreenContainer style={styles.container}>
      <DashboardHeader name={patient?.name ?? 'there'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Upcoming Appointment" />
        {nextAppointment ? (
          <AppointmentCard appointment={nextAppointment} />
        ) : (
          <Card>
            <EmptyState
              icon="calendar-outline"
              title="No upcoming appointments"
              subtitle="Book one through the voice assistant or the button below."
            />
          </Card>
        )}

        <View style={{ height: spacing.lg }} />
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(action.route as any)}
              style={styles.actionTouchable}
            >
              <Card style={styles.actionCard}>
                <Ionicons name={action.icon} size={26} color={colors.primary} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionTouchable: {
    width: '48%',
    marginBottom: spacing.sm,
  },
  actionCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
  },
  actionLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
