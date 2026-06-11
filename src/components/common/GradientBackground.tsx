import React, { memo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { theme } from '../../constants/theme';

export const GradientBackground = memo(function GradientBackground(props: ViewProps) {
  return (
    <View {...props} style={[styles.container, props.style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.01)', theme.colors.background]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

