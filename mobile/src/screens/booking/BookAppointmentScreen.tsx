import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { getDoctors, type DoctorDirectoryEntry } from '../../services/doctorService';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

export function BookAppointmentScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'BookAppointment'>>();
  const [search, setSearch] = useState(route.params?.search ?? route.params?.specialty ?? '');
  const [doctors, setDoctors] = useState<DoctorDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getDoctors().then((result) => {
      if (active) setDoctors(result);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Could not load doctors.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  const query = search.trim().toLowerCase();
  const filtered = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(query) || doctor.specialty.toLowerCase().includes(query)
  );

  return (
    <ScreenContainer>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Text style={styles.title}>Find a doctor</Text>
        <Text style={styles.notice}>
          Online booking and availability are not available yet. Contact your healthcare provider to book.
        </Text>
        <TextInput
          accessibilityLabel="Search doctors by name or specialty"
          style={styles.search}
          placeholder="Search by name or specialty"
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {loading ? <ActivityIndicator color={colors.primary} /> : null}
        {!loading && error ? (
          <>
            <EmptyState title="Doctor directory unavailable" subtitle={error} />
            <Button label="Try again" variant="secondary" onPress={() => {
              setLoading(true);
              setError(null);
              setAttempt((value) => value + 1);
            }} />
          </>
        ) : null}
        {!loading && !error && filtered.length === 0 ? (
          <EmptyState title="No matching doctors" subtitle="Try a different name or specialty." />
        ) : null}
        {!loading && !error ? filtered.map((doctor, index) => (
          <Card key={`${doctor.name}-${doctor.specialty}-${index}`} style={styles.doctor}>
            <View style={styles.icon}>
              <Ionicons name="person-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{doctor.name}</Text>
              <Text style={styles.specialty}>{doctor.specialty}</Text>
              {doctor.workingHours ? <Text style={styles.hours}>{doctor.workingHours}</Text> : null}
            </View>
          </Card>
        )) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  title: { ...typography.h3, color: colors.textPrimary },
  notice: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  search: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  doctor: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  icon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  details: { flex: 1 },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  specialty: { ...typography.body, color: colors.textSecondary },
  hours: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xxs },
});
