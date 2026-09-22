// =============================================================
// components/MicButton.tsx — large circular voice-activation button
// -------------------------------------------------------------
// Visual state changes with the voice assistant state machine
// (see context/VoiceAssistantContext.tsx). The pulsing rings only
// animate while `state === 'listening'`.
// =============================================================
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';
import type { VoiceAssistantState } from '../types';

interface MicButtonProps {
  state: VoiceAssistantState;
  onPress: () => void;
}

export function MicButton({ state, onPress }: MicButtonProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'listening') {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [state, pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  const icon = state === 'processing' ? 'hourglass-outline' : state === 'listening' ? 'mic' : 'mic-outline';
  const backgroundColor = state === 'idle' ? colors.primary : state === 'listening' ? colors.accent : colors.primaryDark;

  return (
    <View style={styles.wrapper}>
      {state === 'listening' && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            { backgroundColor: colors.accent, opacity: ringOpacity, transform: [{ scale: ringScale }] },
          ]}
        />
      )}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Toggle voice assistant listening"
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.button, { backgroundColor }]}
      >
        <Ionicons name={icon as any} size={36} color={colors.textInverse} />
      </TouchableOpacity>
    </View>
  );
}

const SIZE = 88;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
});
