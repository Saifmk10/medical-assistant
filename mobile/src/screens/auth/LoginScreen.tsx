import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing, typography } from '../../theme';

export function LoginScreen() {
  const { login, error: configurationError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await login();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons name="medkit" size={34} color={colors.textInverse} />
        </View>
        <Text style={styles.heroTitle}>Medical Assistant</Text>
        <Text style={styles.heroSubtitle}>Your voice-first healthcare concierge</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.description}>Sign in with Google to continue.</Text>
        <Button
          label="Continue with Google"
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
          icon={<Ionicons name="logo-google" size={20} color={colors.textInverse} />}
        />
        {error || configurationError ? (
          <Text accessibilityRole="alert" style={styles.error}>{error || configurationError}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingTop: 90,
    paddingBottom: 48,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: { ...typography.h1, color: colors.textInverse },
  heroSubtitle: { ...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  form: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  heading: { ...typography.h2, color: colors.textPrimary },
  description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  submitButton: { marginTop: spacing.lg },
  error: { ...typography.body, color: colors.danger, marginTop: spacing.md },
});
