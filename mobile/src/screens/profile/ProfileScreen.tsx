// =============================================================
// screens/profile/ProfileScreen.tsx — patient profile & settings
// -------------------------------------------------------------
// Implements README.md §14 "Patient Profile". Sign-out calls
// AuthContext.logout() which flips RootNavigator back to Login.
// =============================================================
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing, typography } from '../../theme';

export function ProfileScreen() {
  const { patient, logout } = useAuth();
  if (!patient) return null;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{patient.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{patient.name}</Text>
            <Text style={styles.subtitle}>{patient.email}</Text>
          </View>
        </View>

        <Card style={styles.card}>
          <InfoRow icon="call-outline" label="Phone" value={patient.phone} />
          <InfoRow icon="calendar-outline" label="Date of birth" value={patient.dateOfBirth} />
          <InfoRow icon="location-outline" label="Preferred location" value={patient.preferredLocation ?? '—'} />
        </Card>

        <Button label="Sign Out" variant="secondary" onPress={logout} style={styles.signOut} />
      </ScrollView>
    </ScreenContainer>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: { ...typography.h3, color: colors.textInverse },
  name: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  card: { marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  infoTextWrap: { marginLeft: spacing.sm },
  infoLabel: { ...typography.caption, color: colors.textTertiary },
  infoValue: { ...typography.bodyMedium, color: colors.textPrimary, marginTop: 2 },
  signOut: { marginTop: spacing.sm },
});
