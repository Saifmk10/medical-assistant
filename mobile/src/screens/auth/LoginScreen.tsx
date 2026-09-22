// =============================================================
// screens/auth/LoginScreen.tsx — patient sign-in
// -------------------------------------------------------------
// Simple phone-number entry that calls AuthContext.login(). In a
// real build this should trigger an OTP flow against the backend's
// /auth endpoints before setting the authenticated patient.
// =============================================================
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing, typography } from '../../theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await login(phone);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons name="medkit" size={34} color={colors.textInverse} />
        </View>
        <Text style={styles.heroTitle}>Medical Assistant</Text>
        <Text style={styles.heroSubtitle}>Your voice-first healthcare concierge</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 98765 43210"
          placeholderTextColor={colors.textTertiary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoComplete="tel"
        />
        <Button
          label="Continue"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={phone.trim().length < 6}
          style={styles.submitButton}
        />
        <Text style={styles.disclaimer}>
          By continuing you agree to receive appointment updates via SMS and app notifications.
        </Text>
      </View>
    </KeyboardAvoidingView>
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
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  submitButton: { marginTop: spacing.lg },
  disclaimer: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
