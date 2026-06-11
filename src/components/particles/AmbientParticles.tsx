import React, { memo, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '../../constants/theme';

type Particle = {
  id: string;
  xPct: number;
  size: number;
  opacity: number;
  durationMs: number;
  delayMs: number;
  hue: 'yellow' | 'teal' | 'coral' | 'pink';
};

const AmbientParticleDot = memo(function AmbientParticleDot({ particle }: { particle: Particle }) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming((Math.random() - 0.5) * width * 0.06, { duration: particle.durationMs, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    translateY.value = withRepeat(
      withTiming(-40, { duration: particle.durationMs + 600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    scale.value = withRepeat(
      withSpring(1.15, { damping: 10, stiffness: 120 }),
      -1,
      true
    );
  }, [particle.durationMs, scale, translateX, translateY, width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: particle.opacity,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const color =
    particle.hue === 'yellow'
      ? theme.colors.yellow
      : particle.hue === 'teal'
        ? theme.colors.teal
        : particle.hue === 'coral'
          ? theme.colors.coral
          : theme.colors.pink;

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: width * particle.xPct,
          width: particle.size,
          height: particle.size,
          backgroundColor: color,
          marginLeft: -particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
});

export const AmbientParticles = memo(function AmbientParticles() {
  const particles = useMemo<Particle[]>(() => {
    const hues: Particle['hue'][] = ['yellow', 'teal', 'coral', 'pink'];
    return Array.from({ length: 14 }).map((_, idx) => {
      const hue = hues[idx % hues.length];
      return {
        id: String(idx),
        xPct: Math.random() * 0.9 + 0.05,
        size: Math.random() * 8 + 6,
        opacity: Math.random() * 0.35 + 0.15,
        durationMs: Math.random() * 2200 + 1400,
        delayMs: Math.random() * 500,
        hue,
      };
    });
  }, []);

  return (
    <View pointerEvents="none" style={styles.container}>
      {particles.map((p) => (
        <AmbientParticleDot key={p.id} particle={p} />
      ))}
      <View style={styles.vignette} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  dot: {
    position: 'absolute',
    top: 140,
    borderRadius: 999,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

});
