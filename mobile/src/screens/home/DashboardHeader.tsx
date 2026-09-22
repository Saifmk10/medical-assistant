// =============================================================
// screens/home/DashboardHeader.tsx — greeting banner for the Dashboard
// -------------------------------------------------------------
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../theme';

export function DashboardHeader({ name }: { name: string }) {
  const firstName = name.split(' ')[0];
  return (
    <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.hero}>
      <View style={styles.row}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.subtitle}>How can we help with your health today?</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={colors.textInverse} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { ...typography.h2, color: colors.textInverse },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.9)', marginTop: 4, maxWidth: 220 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
