import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import type { VoiceAssistantState } from '../types';

interface VoiceOrbProps {
  state: VoiceAssistantState;
  /** Live loudness, 0 (silent) – 1 (loud). The orb only moves while this is above 0. */
  level: Animated.Value;
  size: number;
}

const ROWS = 31;
const COLUMNS = 35;

export function VoiceOrb({ state, level, size }: VoiceOrbProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

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

  // Tint the grid cooler while listening to the user and warmer while the assistant replies,
  // so the two speakers read as visually distinct, like a ChatGPT-style voice mode.
  const stateBias = state === 'responding' ? 0.3 : state === 'listening' ? -0.15 : 0;

  const rows = useMemo(() => Array.from({ length: ROWS }, (_, row) => {
    const y = (row / (ROWS - 1)) * 2 - 1;
    const width = Math.sqrt(Math.max(0, 1 - y * y));
    return Array.from({ length: COLUMNS }, (_, column) => {
      const x = (column / (COLUMNS - 1)) * 2 - 1;
      const wave = Math.sin(y * 6 + x * 3) * 0.045 + Math.sin(x * 7 - y * 4) * 0.025;
      const purple = Math.max(0, Math.min(1, (y + 0.15) * 1.15 + stateBias));
      const red = Math.round(54 + purple * 145);
      const green = Math.round(175 - purple * 91);
      const blue = 255;
      const dotSize = Math.max(1.4, size * (0.008 + 0.003 * (1 - Math.abs(x))));
      return {
        left: size * (0.5 + x * width * 0.45) - dotSize / 2,
        top: size * (0.5 + y * 0.43 + wave * width) - dotSize / 2,
        size: dotSize,
        color: `rgb(${red}, ${green}, ${blue})`,
        opacity: 0.45 + 0.55 * (1 - Math.abs(x) * 0.55),
      };
    });
  }), [size, stateBias]);

  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
      {rows.map((dots, row) => {
        const direction = Math.sin(row * 0.6);
        const transform = reduceMotion ? [] : [
          { translateX: level.interpolate({ inputRange: [0, 1], outputRange: [0, size * 0.05 * direction] }) },
          { translateY: level.interpolate({ inputRange: [0, 1], outputRange: [0, size * 0.045 * Math.cos(row * 0.45)] }) },
          { scale: level.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) },
        ];
        return (
          <Animated.View key={row} style={[StyleSheet.absoluteFill, { transform }]}>
            {dots.map((dot, column) => (
              <View
                key={column}
                style={{
                  position: 'absolute',
                  left: dot.left,
                  top: dot.top,
                  width: dot.size,
                  height: dot.size,
                  borderRadius: dot.size / 2,
                  backgroundColor: dot.color,
                  opacity: dot.opacity,
                }}
              />
            ))}
          </Animated.View>
        );
      })}
    </View>
  );
}
