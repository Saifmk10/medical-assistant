import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import type { VoiceAssistantState } from '../types';

interface VoiceWaveProps {
  state: VoiceAssistantState;
  /** Live loudness, 0 (silent) – 1 (loud). */
  level: Animated.Value;
}

const BAR_COUNT = 27;
const BAR_WIDTH = 4;
const BAR_GAP = 5;
const HEIGHT = 132;
const KEYFRAMES = 8;
const MIN_SCALE = 0.05;
const RESTING_AMPLITUDE = 0.12;
const THINKING_AMPLITUDE = 0.4;

const COLOR_BY_STATE: Record<VoiceAssistantState, string> = {
  idle: '#9DBDF0',
  processing: '#9DBDF0',
  listening: '#3B8CF2',
  responding: '#1F66D0',
};

export function VoiceWave({ state, level }: VoiceWaveProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [phase] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const moving = state !== 'idle' && !reduceMotion;
  useEffect(() => {
    if (!moving) return;
    const loop = Animated.loop(
      Animated.timing(phase, { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => {
      loop.stop();
      phase.setValue(0);
    };
  }, [moving, phase]);

  // Each bar follows the same travelling sine, offset by its position, so the row reads as one wave.
  const bars = useMemo(() => Array.from({ length: BAR_COUNT }, (_, index) => {
    const position = index / (BAR_COUNT - 1);
    const envelope = 0.3 + 0.7 * Math.pow(Math.sin(Math.PI * position), 1.4);
    const shape = phase.interpolate({
      inputRange: Array.from({ length: KEYFRAMES + 1 }, (_, step) => step / KEYFRAMES),
      outputRange: Array.from({ length: KEYFRAMES + 1 }, (_, step) =>
        0.3 + 0.7 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (step / KEYFRAMES + position * 1.1)))),
    });
    return { envelope, shape };
  }), [phase]);

  const amplitude: Animated.Animated | number = state === 'listening' || state === 'responding'
    ? level.interpolate({ inputRange: [0, 1], outputRange: [0.14, 1], extrapolate: 'clamp' })
    : state === 'processing' ? THINKING_AMPLITUDE : RESTING_AMPLITUDE;
  const color = COLOR_BY_STATE[state];

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.wave}
    >
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              opacity: 0.45 + 0.55 * bar.envelope,
              transform: [{
                scaleY: Animated.multiply(Animated.add(MIN_SCALE, Animated.multiply(bar.shape, amplitude)), bar.envelope),
              }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wave: { height: HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: BAR_GAP },
  bar: { width: BAR_WIDTH, height: HEIGHT, borderRadius: BAR_WIDTH / 2 },
});
