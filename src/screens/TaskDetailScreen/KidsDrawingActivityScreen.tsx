import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal, GestureResponderEvent } from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../navigation/RootNavigator';

type DrawingScreenProp = NativeStackNavigationProp<RootStackParamList, 'KidsDrawingActivity'>;

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'];
const TOTAL_TIME = 300; // 5 minutes in seconds

type Stroke = {
  color: string;
  path: string;
};

export default function KidsDrawingActivityScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawingScreenProp>();

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showParentInfo, setShowParentInfo] = useState(true);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const isActivityDone = timeLeft === 0 || isFinished;

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, isFinished]);

  // Touch Events for Drawing
  const handleTouchStart = (event: GestureResponderEvent) => {
    if (isActivityDone) return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentStroke({
      color: selectedColor,
      path: `M ${locationX} ${locationY}`,
    });
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (isActivityDone || !currentStroke) return;
    const { locationX, locationY } = event.nativeEvent;
    setCurrentStroke((prev) => prev ? { ...prev, path: `${prev.path} L ${locationX} ${locationY}` } : prev);
  };

  const handleTouchEnd = () => {
    if (currentStroke) {
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke(null);
    }
  };

  const resetActivity = () => {
    setTimeLeft(TOTAL_TIME);
    setStrokes([]);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCompleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDone = () => {
    setShowConfirmModal(false);
    setIsFinished(true); // Triggers the joyful success modal
  };

  const handleCancelDone = () => {
    setShowConfirmModal(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header & Timer */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏳ {formatTime(timeLeft)}</Text>
        </View>
      </Animated.View>

      {/* Parent Info Card (Collapsible) */}
      {showParentInfo && (
        <Animated.View entering={FadeInUp.delay(200)} style={styles.parentCard}>
          <View style={styles.parentCardHeader}>
            <Text style={styles.parentCardTitle}>✨ Magic Finger Painting</Text>
            <Pressable
              style={styles.closeInfoBtn}
              onPress={() => setShowParentInfo(false)}
            >
              <Text style={styles.closeInfoText}>Got it</Text>
            </Pressable>
          </View>
          <Text style={styles.parentCardDesc}>
            <Text style={{ fontWeight: '700' }}>Why kids love it:</Text> Allows them to
            explore colors, improves fine motor skills, and gives immediate visual
            feedback without the mess!
          </Text>
        </Animated.View>
      )}

      {/* Interactive Canvas Area */}
      <Animated.View
        entering={ZoomIn.delay(300).springify().damping(18)}
        style={[styles.canvasContainer, isActivityDone && styles.canvasDisabled]}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Svg style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, index) => (
            <Path
              key={index}
              d={stroke.path}
              stroke={stroke.color}
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          {currentStroke && (
            <Path
              d={currentStroke.path}
              stroke={currentStroke.color}
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
        
        {strokes.length === 0 && !currentStroke && (
          <View style={styles.canvasContent} pointerEvents="none">
            <Text style={styles.canvasPlaceholderText}>
              {!isActivityDone ? '🎨 Draw your masterpiece here!' : 'Awesome job! ⭐'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Color Selection Palette */}
      <Animated.View entering={SlideInDown.delay(400).springify()} style={styles.paletteContainer}>
        {COLORS.map((color, idx) => {
          const isSelected = selectedColor === color;
          return (
            <Pressable
              key={idx}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                isSelected && styles.colorSwatchSelected,
              ]}
            />
          );
        })}
      </Animated.View>

      {/* Bottom Action Buttons (Restart & Complete) */}
      {!isActivityDone && (
        <Animated.View entering={SlideInDown.delay(500).springify()} style={styles.actionButtonsContainer}>
          <Pressable style={styles.restartBtn} onPress={resetActivity}>
            <Text style={styles.restartBtnText}>🔄 Restart</Text>
          </Pressable>
          
          <Pressable style={styles.completeBtn} onPress={handleCompleteClick}>
            <Text style={styles.completeBtnText}>✨ Finish Early</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Combined Single Modal (Fixes Android Modal Overlap & Animation Bugs) */}
      <Modal 
        visible={isActivityDone || showConfirmModal} 
        transparent 
        animationType="fade"
        onRequestClose={isActivityDone ? resetActivity : handleCancelDone}
      >
        <View style={styles.modalOverlay}>
          {isActivityDone ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>{isFinished ? '🏆' : '🌟'}</Text>
              <Text style={styles.successTitle}>
                {isFinished ? 'CONGRATULATIONS! 🎉' : 'Ta-da! Time is up! ⏰'}
              </Text>
              <Text style={styles.successDesc}>
                {isFinished 
                  ? 'You made something truly magical! You are a super artist! 🌟✨' 
                  : 'Wow! Look at this amazing art you created! 🎨🌟'}
              </Text>

              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryBtnText}>🖼️ Save to Gallery</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={resetActivity}>
                <Text style={styles.secondaryBtnText}>🔄 Play Again</Text>
              </Pressable>
            </View>
          ) : showConfirmModal ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>🎨</Text>
              <Text style={styles.successTitle}>All Done?</Text>
              <Text style={styles.successDesc}>
                Are you ready to show off your magical masterpiece? ✨
              </Text>

              <View style={styles.confirmBtnRow}>
                <Pressable style={styles.cancelBtn} onPress={handleCancelDone}>
                  <Text style={styles.cancelBtnText}>Keep Drawing 🖍️</Text>
                </Pressable>
                <Pressable style={styles.yesBtn} onPress={handleConfirmDone}>
                  <Text style={styles.yesBtnText}>Yes, I'm Done! 🚀</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Soft playful pastel blue
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  backBtn: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  timerBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  parentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  parentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parentCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A535C',
  },
  closeInfoBtn: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  closeInfoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  parentCardDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 24,
  },
  canvasDisabled: {
    opacity: 0.6,
  },
  canvasContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasPlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  paletteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 24,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#1A535C',
    transform: [{ scale: 1.15 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 83, 92, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1A535C', marginBottom: 12 },
  successDesc: { fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  primaryButton: { width: '100%', backgroundColor: '#4ECDC4', paddingVertical: 18, borderRadius: 100, alignItems: 'center', marginBottom: 16 },
  primaryBtnText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  secondaryButton: { width: '100%', backgroundColor: '#FFF5F5', paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  secondaryBtnText: { fontSize: 18, fontWeight: '800', color: '#FF6B6B' },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    zIndex: 10,
    elevation: 10,
  },
  restartBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  restartBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4ECDC4',
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#1A535C',
    paddingVertical: 16,
    marginLeft: 16,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#1A535C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  completeBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  cancelBtn: { flex: 1, backgroundColor: '#F0F8FF', paddingVertical: 16, borderRadius: 100, alignItems: 'center', marginRight: 8 },
  cancelBtnText: { fontSize: 16, fontWeight: '800', color: '#4ECDC4' },
  yesBtn: { flex: 1, backgroundColor: '#FF6B6B', paddingVertical: 16, borderRadius: 100, alignItems: 'center', marginLeft: 8, shadowColor: '#FF6B6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  yesBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});