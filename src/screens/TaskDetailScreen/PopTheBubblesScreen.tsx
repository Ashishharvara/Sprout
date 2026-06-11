import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Animated } from 'react-native';
import Sound from 'react-native-sound';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

Sound.setCategory('Playback');

const { width, height } = Dimensions.get('window');

// --- Configuration ---
const BUBBLE_COLORS = ['#FFB6C1', '#FFFACD', '#98FB98', '#FFDAB9', '#E0FFFF']; // Vibrant pastels
const NUM_BUBBLES = 13; // Increased the number of bubbles
const LAYOUT_TYPES = ['grid', 'circle', 'scatter']; // Added multiple layout designs

/**
 * Helper: Generates an array of random bubbles.
 * By using a unique `id` with Date.now(), we ensure that when bubbles are regenerated,
 * React treats them as entirely new components, triggering our pop-in spring animation.
 */
const generateBubbles = (layoutType = 'grid') => {
  const COLS = 3;
  const ROWS = Math.ceil(NUM_BUBBLES / COLS);
  const CELL_WIDTH = width / COLS;
  const PLAY_AREA_HEIGHT = height - 280; // Leaves space for title and bottom button
  const CELL_HEIGHT = PLAY_AREA_HEIGHT / ROWS;

  return Array.from({ length: NUM_BUBBLES }).map((_, index) => {
    const size = Math.random() * 25 + 90; // Balanced size (90-115) to fit perfectly in a grid
    let x = 0;
    let y = 0;

    if (layoutType === 'grid') {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const staggerOffset = row % 2 !== 0 ? CELL_WIDTH / 2 : 0;
      x = (col * CELL_WIDTH) + staggerOffset + (CELL_WIDTH / 2) - (size / 2);
      y = (row * CELL_HEIGHT) + (CELL_HEIGHT / 2) - (size / 2) + 20;
    } else if (layoutType === 'circle') {
      const cx = width / 2;
      const cy = PLAY_AREA_HEIGHT / 2 + 20;
      const radius = (width - 130) / 2; 
      const angle = (index / NUM_BUBBLES) * 2 * Math.PI;
      x = cx + radius * Math.cos(angle) - (size / 2);
      y = cy + radius * Math.sin(angle) - (size / 2);
    } else {
      // 'scatter' random layout
      x = Math.random() * (width - size - 20) + 10;
      y = Math.random() * (PLAY_AREA_HEIGHT - size) + 20;
    }

    // Ensure staggered bubbles don't overflow the right edge of the screen
    if (x + size > width - 10) x = width - size - 15;
    if (x < 10) x = 10;
    if (y < 20) y = 20;

    return {
      id: `${Date.now()}-${index}`,
      color: BUBBLE_COLORS[index % BUBBLE_COLORS.length],
      size: size,
      x: x,
      y: y,
    };
  });
};

/**
 * Interactive Bubble Component
 */
const Bubble = ({ bubble, onPop }: { bubble: any; onPop: () => void }) => {
  const scale = useRef(new Animated.Value(0)).current; // Start scale at 0 for the entry animation
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    // 1. Smooth spring animation when the bubble first appears on screen
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = () => {
    if (popped) return; // Prevent double-tapping
    setPopped(true);
    
    // Trigger sound effect
    onPop();

    // 2. Pop Animation Sequence: Scale up slightly, then quickly shrink to 0 to simulate popping
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 0,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{ scale: scale }],
  };

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        { left: bubble.x, top: bubble.y, width: bubble.size, height: bubble.size },
        animatedStyle,
      ]}
    >
      <Pressable onPress={handlePress} style={styles.bubblePressable}>
        <View style={[styles.bubble, { backgroundColor: bubble.color, borderRadius: bubble.size / 2 }]}>
          {/* Subtle white shine/reflection for a 3D bubble effect */}
          <View style={[styles.shine, { width: bubble.size * 0.3, height: bubble.size * 0.15 }]} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Main Screen Component
 */
export default function PopTheBubblesScreen() {
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [bubbles, setBubbles] = useState(generateBubbles(LAYOUT_TYPES[0]));
  
  // Sound pool for zero-latency, overlapping sound effects
  const soundPool = useRef<Sound[]>([]);
  const poolIndex = useRef(0);
  
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Pre-load enough sounds to match the exact number of bubbles on screen
    const pool = Array.from({ length: NUM_BUBBLES }).map(() => {
      return new Sound('https://actions.google.com/sounds/v1/cartoon/pop.ogg', null, (error) => {
        if (error) console.log('Error loading sound:', error);
      });
    });
    soundPool.current = pool;

    return () => {
      pool.forEach(s => s.release());
    };
  }, []);

  const playPopSound = () => {
    if (soundPool.current.length > 0) {
      const sound = soundPool.current[poolIndex.current];
      if (sound) {
        sound.stop();
        sound.setCurrentTime(0);
        sound.play();
      }
      poolIndex.current = (poolIndex.current + 1) % soundPool.current.length;
    }
  };

  const handleRespawn = () => {
    // Generating new bubbles assigns them new unique IDs, 
    // forcing React to remount them and naturally trigger the entry spring animation.
    const nextIndex = (layoutIndex + 1) % LAYOUT_TYPES.length;
    setLayoutIndex(nextIndex);
    setBubbles(generateBubbles(LAYOUT_TYPES[nextIndex]));
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      {/* Header for Back Button */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Pop the Bubbles!</Text>
      
      {/* Play Area Canvas */}
      <View style={styles.playArea}>
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} bubble={bubble} onPop={playPopSound} />
        ))}
      </View>

      {/* Re-spawn Mechanism Button */}
      <Pressable style={styles.resetButton} onPress={handleRespawn}>
        <Text style={styles.resetButtonText}>More Bubbles! 🎈</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Solid sky-blue color
    alignItems: 'center',
    paddingBottom: 60,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 10,
    marginTop: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  playArea: {
    flex: 1,
    width: '100%',
    position: 'relative', // Contains absolute position of floating bubbles
  },
  bubbleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubblePressable: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: '15%',
    paddingLeft: '15%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6, // for Android dropshadows
  },
  shine: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // Semi-transparent white
    borderRadius: 100,
    transform: [{ rotate: '-30deg' }], // Positions the shine to look like 3D light reflection
  },
  resetButton: {
    backgroundColor: '#FF6B6B', // Friendly warm coral
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  resetButtonText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});