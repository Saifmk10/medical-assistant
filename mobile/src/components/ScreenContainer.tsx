// =============================================================
// components/ScreenContainer.tsx — safe-area + background wrapper
// -------------------------------------------------------------
// Wrap every screen's root content in this so status-bar insets and
// the app background color are handled in exactly one place.
// =============================================================
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface ScreenContainerProps extends ViewProps {
  edges?: Edge[];
  scrollable?: boolean;
}

export function ScreenContainer({
  style,
  children,
  edges = ['top', 'left', 'right'],
  ...rest
}: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      <View style={[styles.content, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
