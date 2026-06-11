import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../../constants/theme';

import { AmbientParticles } from '../../components/particles/AmbientParticles';
import { AppLogoMark } from '../../components/common/AppLogoMark';
import { RootStackParamList } from '../../navigation/RootNavigator';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, {
      damping: 18,
      stiffness: 140,
      mass: 0.9,
      overshootClamping: true,
    });

    const t = setTimeout(() => {
      navigation.replace('Home');
    }, 1600);

    return () => clearTimeout(t);
  }, [navigation, progress]);

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.85, 1]);
    const translateY = interpolate(progress.value, [0, 1], [18, 0]);
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.container]} entering={FadeIn.duration(600)}>
      <StatusBar barStyle="light-content" />
      <AmbientParticles />

      <Animated.View style={styles.center}>
        <Animated.View style={logoStyle}>
          <AppLogoMark />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
