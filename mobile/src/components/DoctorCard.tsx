// =============================================================
// components/DoctorCard.tsx — provider summary card
// -------------------------------------------------------------
// Used in doctor search results during the booking flow. Tapping it
// should navigate to slot selection for that doctor.
// =============================================================
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, radii, spacing, typography } from '../theme';
import type { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onPress?: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const initials = doctor.name
    .replace('Dr. ', '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="button">
      <Card style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty} · {doctor.qualification}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.metaText} numberOfLines={1}>{doctor.clinic} — {doctor.location}</Text>
          </View>
          {doctor.rating ? (
            <View style={styles.metaRow}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={styles.metaText}>{doctor.rating.toFixed(1)} · {doctor.yearsExperience ?? 0} yrs experience</Text>
            </View>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  specialty: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: 4,
    flexShrink: 1,
  },
});
