// =============================================================
// components/Button.tsx — primary call-to-action button
// -------------------------------------------------------------
// Variants: "primary" (solid brand color), "secondary" (outlined),
// "ghost" (text-only). Use this everywhere instead of a raw
// <TouchableOpacity> so button styling stays consistent.
// =============================================================
import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, textVariantStyles[variant], icon ? { marginLeft: spacing.xs } : null]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    minHeight: 50,
  },
  label: {
    ...typography.button,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
};

const textVariantStyles: Record<ButtonVariant, { color: string }> = {
  primary: { color: colors.textInverse },
  secondary: { color: colors.primary },
  ghost: { color: colors.primary },
  danger: { color: colors.textInverse },
};
