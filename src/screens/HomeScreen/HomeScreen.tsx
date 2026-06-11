import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/RootNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface GetItButtonProps {
  customStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title?: string;
}

// --- Reusable 3D "Get it" Button ---
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const GetItButton = ({ customStyle, onPress, title = "Get it" }: GetItButtonProps) => {
  const pressScale = React.useRef(new Animated.Value(1)).current;
  const pulseScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Continuous smooth pulse animation to attract the user's attention
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.05, // Slightly grow
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1, // Shrink back to normal
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseScale]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.92, // Slight scale down for a 3D squish effect
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1, // Bounce back to original size
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchableOpacity 
      activeOpacity={0.85} 
      style={[styles.btnOuter, customStyle, { transform: [{ scale: pressScale }, { scale: pulseScale }] }]} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.btnInner}>
        <Text style={styles.btnText}>{title}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

interface GameCardProps {
  title: string;
  imageSource: ImageSourcePropType;
  bgColor: string;
  onPress?: () => void;
  delay?: number;
}

// --- Reusable Game Card ---
const GameCard = ({ title, imageSource, bgColor, onPress, delay = 0 }: GameCardProps) => {
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -8, // Softly float up by 8 pixels
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0, // Float back down to original position
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Stagger the start of the animation if a delay is provided
    if (delay > 0) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    } else {
      startAnimation();
    }
  }, [floatAnim, delay]);

  return (
    <View style={styles.smallCardContainer}>
      <Animated.View style={[styles.smallCardImageWrapper, { backgroundColor: bgColor, transform: [{ translateY: floatAnim }] }]}>
        <Image 
          source={imageSource} 
          style={styles.smallCardImage}
          resizeMode="cover"
        />
      </Animated.View>
      <Text style={styles.smallCardTitle}>{title}</Text>
      <GetItButton customStyle={{ width: '80%' }} onPress={onPress} title="Play" />
    </View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2247" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- Hero Banner (Puzzle Game) --- */}
        <View style={styles.heroBannerShadow}>
          <View style={styles.heroBanner}>
            {/* Note: In a real app, use a single illustration PNG for the background+animals */}
            <View style={styles.heroBackground}>
              {/* Mock Sky & Grass for structure */}
              <View style={styles.heroSky}>
                <Text style={styles.heroTitle}>Drawing</Text>
                <Text style={styles.heroSubtitle}>To stimulate kids brain</Text>
              </View>
              <View style={styles.heroGrass} />
              
              {/* Banner Image */}
              <Image 
                source={require('./D.png')} 
                style={styles.fullBannerImage} 
                resizeMode="cover"
              />
              
              {/* Main Get It Button */}
              <View style={styles.heroButtonContainer}>
                <GetItButton customStyle={{ width: 150 }} onPress={() => navigation.navigate('KidsDrawingActivity' as never)} title="Start" />
              </View>
            </View>
          </View>
        </View>

        {/* --- Section Header --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best for today</Text>
          {/* Custom Indicator Line */}
          <View style={styles.indicatorRow}>
            <View style={styles.indicatorActive} />
            <View style={styles.indicatorInactive} />
          </View>
        </View>

        {/* --- Horizontal Scroll Cards (Bottom Section) --- */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalScrollContent}
          decelerationRate="fast"
        >
          <GameCard 
            title="Pop Bubbles"
            bgColor="#0bd1beff" // Blue
            imageSource={require('./B.png')} // Local Bubbles image
            onPress={() => navigation.navigate('PopTheBubbles' as never)}
            delay={0} 
          />
          <GameCard 
            title="Puzzle"
            bgColor="#7C5CFF" // Purple
            imageSource={require('./P.png')} // Local Puzzle brain image
            onPress={() => navigation.navigate('Puzzle' as never)}
            delay={500} 
          />
          <GameCard 
            title="Scan Tech"
            bgColor="#FF9F1C" // Bright Orange
            imageSource={require('./S.png')} // Local Camera device image
            onPress={() => navigation.navigate('ScavengerHunt' as never)}
            delay={1000} 
          />
        </ScrollView>

        <View style={{ height: 40 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#1F2247' // Retained Luxury Dark Navy background
  },

  // --- Main Scroll Content ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  // --- Reusable 3D Button Styles ---
  btnOuter: {
    backgroundColor: '#D6EFFF', // Light blue bottom shadow
    borderRadius: 24,
    marginTop: 10,
    alignSelf: 'center',
  },
  btnInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    transform: [{ translateY: -4 }], // Pulls the white button up to reveal the blue shadow below
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#422411', // Dark brown
  },

  // --- Hero Banner ---
  heroBannerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    marginBottom: 35,
    borderRadius: 36,
    backgroundColor: '#8B4513',
  },
  heroBanner: {
    width: '100%',
    height: 320,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#8B4513', // Brown background behind the image
  },
  heroBackground: {
    flex: 1,
    position: 'relative',
  },
  heroSky: {
    flex: 0.6,
    alignItems: 'center',
    paddingTop: 28,
  },
  heroGrass: {
    flex: 0.4,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#422411',
    marginBottom: 6,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 17,
    color: '#422411',
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  fullBannerImage: {
    position: 'absolute',
    width: "130%",
    height: '90%',
    top: 20,

    zIndex: 3,
  },
  heroButtonContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF', // Changed to white to contrast with the dark navy background
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorActive: {
    width: 20,
    height: 6,
    backgroundColor: '#FF6B00', // Orange
    borderRadius: 3,
  },
  indicatorInactive: {
    width: 40,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', // Adjusted for dark background
    borderRadius: 3,
    marginLeft: 4,
  },

  // --- Grid ---
  horizontalScroll: {
    marginHorizontal: -20, // Pull out to bleed to edges
  },
  horizontalScrollContent: {
    paddingHorizontal: 20, // Add padding back for the content
    paddingRight: 40, // Extra padding at the end so the last card isn't cut off
  },
  smallCardContainer: {
    width: 150,
    marginRight: 20,
    alignItems: 'center',
  },
  smallCardImageWrapper: {
    width: '100%',
    aspectRatio: 1, // Makes it a perfect square
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    // Soft shadow to pop against the dark navy background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  smallCardImage: {
    width: '100%',
    height: '100%',
    // Dynamic sizes passed via props
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF', // Changed to white to contrast with the dark navy background
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 40, // Ensures buttons align even if title wraps
  },
});