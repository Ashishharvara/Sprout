import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { theme } from '../../constants/theme';

export function AppLogoMark() {
  return (
    <View style={styles.wrap} accessibilityRole="image" accessibilityLabel="Sprout logo">
      <Svg width={140} height={140} viewBox="0 0 140 140">
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={theme.colors.yellow} stopOpacity={1} />
            <Stop offset="1" stopColor={theme.colors.teal} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Circle cx={70} cy={70} r={62} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        <Circle cx={70} cy={70} r={46} fill="url(#g)" opacity={0.9} />
        <Circle cx={70} cy={70} r={26} fill="rgba(31,34,71,0.35)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

