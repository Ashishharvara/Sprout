import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Sound from 'react-native-sound';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

Sound.setCategory('Playback');

export default function ScavengerHuntScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  
  // Game State
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [missionAccomplished, setMissionAccomplished] = useState(false);

  // Animations
  const starScale = useRef(new Animated.Value(0)).current;

  // Auto-request permission when the screen mounts
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const playWinSound = () => {
    // Using a remote mock cheer sound for immediate testing
    const winSound = new Sound('https://actions.google.com/sounds/v1/foley/crowd_cheer.ogg', undefined, (error: any) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      winSound.play(() => {
        winSound.release();
      });
    });
  };

  const handleRequestPermission = async () => {
    const isGranted = await requestPermission();
    if (!isGranted) {
      // eslint-disable-next-line no-alert
      const showAlert = (msg: string) => {
        // @ts-expect-error - React Native global alert type varies by RN typings
        global.alert?.(msg);
      };
      showAlert('Permission denied! Please go to your device Settings -> Apps -> Sprout -> Permissions and allow Camera access.');
    }
  };

  const handleSnap = () => {
    if (analyzing) return;
    
    setAnalyzing(true);

    // Mock analyzing delay (1.5 seconds)
    setTimeout(() => {
      setAnalyzing(false);
      const newProgress = progress + 1;
      setProgress(newProgress);

      if (newProgress <5) {
        // Random playful feedback for finding an item
        const devices = ["TV", "Fan", "Microwave", "Lamp", "Computer"];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        // eslint-disable-next-line no-alert
        console.log(`Awesome! You found a ${randomDevice}! 🌟`);
      } else {
        // Mission complete!
        setMissionAccomplished(true);
        playWinSound();
        Animated.spring(starScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    }, 1500);
  };

  const handlePlayAgain = () => {
    setProgress(0);
    setMissionAccomplished(false);
    starScale.setValue(0);
  };

  if (!hasPermission) {
    // Camera permissions are not granted yet.
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.permissionText}>We need your permission to show the camera!</Text>
        <TouchableOpacity style={styles.snapButton} onPress={handleRequestPermission}>
          <Text style={styles.snapText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Reward Screen UI ---
  if (missionAccomplished) {
    return (
      <View style={[styles.container, styles.rewardContainer, { paddingTop: insets.top }]}>
        <Text style={styles.rewardTitle}>Mission Accomplished!</Text>
        
        <Animated.View style={[styles.starBadge, { transform: [{ scale: starScale }] }]}>
          <Text style={styles.starText}>⭐</Text>
          <Text style={styles.badgeText}>Gold Star!</Text>
        </Animated.View>

        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.playAgainButton, { backgroundColor: '#FF6B6B', marginTop: 15 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.playAgainText}>Back Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Main Camera UI ---
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Header & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Find 5 Electrical Devices!</Text>
        
        <View style={styles.progressTracker}>
          <Text style={styles.progressText}>Progress: {progress}/5</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(progress / 5) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        {device != null ? (
          <Camera 
            style={StyleSheet.absoluteFill} 
            device={device} 
            isActive={!analyzing && !missionAccomplished} 
          />
        ) : (
          <View style={styles.camera}><Text style={{color: 'white'}}>No Camera Found</Text></View>
        )}
        {/* Overlay when analyzing */}
        {analyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.analyzingText}>Analyzing...</Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.snapButton, analyzing && { opacity: 0.5 }]} 
          onPress={handleSnap}
          disabled={analyzing}
        >
          <Text style={styles.snapText}>SNAP! 📸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky Blue
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    marginBottom: 15,
  },
  progressTracker: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  progressBarBg: {
    width: '80%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#32CD32', // Lime Green
    borderRadius: 10,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#FFD700', // Yellow playful border
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 15,
  },
  controlsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  snapButton: {
    backgroundColor: '#FF4500', // Orange Red
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  snapText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  permissionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 20,
  },

  // --- Reward Screen Styles ---
  rewardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700', // Golden background for win
  },
  rewardTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FF4500',
    textAlign: 'center',
    marginBottom: 30,
  },
  starBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  starText: {
    fontSize: 80,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#32CD32',
    marginTop: 10,
  },
  playAgainButton: {
    backgroundColor: '#1E90FF', // Dodger Blue
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '70%',
    alignItems: 'center',
  },
  playAgainText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  }
});