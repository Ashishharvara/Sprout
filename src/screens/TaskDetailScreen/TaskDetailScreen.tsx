import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Task } from '../../constants/data';
import { RootStackParamList } from '../../navigation/RootNavigator';

type TaskDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const insets = useSafeAreaInsets();
  
  const task = route.params.task;

  if (!task) return null;

  const handleStartTask = () => {
    if (task.id === '1') {
      navigation.navigate('KidsDrawingActivity');
    } else if (task.id === '2') {
      navigation.navigate('PopTheBubbles');
    } else {
      console.log(`Navigation for Task ${task.number} is not implemented yet.`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <Animated.View 
          entering={FadeIn.duration(400)} 
          style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: task.color }]}
        >
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>{task.title}</Text>
        </Animated.View>

        <Animated.View entering={SlideInDown.duration(500).springify()} style={styles.content}>
          <View style={styles.metaContainer}>
            <Text style={styles.metaLabel}>Estimated Time</Text>
            <Text style={styles.metaValue}>{task.estimatedTime}</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>

          <Text style={styles.sectionTitle}>Objectives</Text>
          {task.objectives.map((obj, i) => (
            <View key={i} style={styles.objectiveRow}>
              <View style={[styles.bullet, { backgroundColor: task.color }]} />
              <Text style={styles.objectiveText}>{obj}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View 
        entering={SlideInDown.delay(300).springify()} 
        style={[styles.fabContainer, { paddingBottom: insets.bottom || 24 }]}
      >
        <Pressable 
          onPress={handleStartTask} 
          style={[styles.fab, { backgroundColor: task.color }]}
        >
          <Text style={styles.fabText}>Start Task</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F2247' },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: { marginBottom: 24 },
  backText: { fontSize: 16, fontWeight: '600', color: '#1F2247' },
  title: { fontSize: 32, fontWeight: '800', color: '#1F2247', lineHeight: 40 },
  content: { padding: 24 },
  metaContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)', padding: 16,
    borderRadius: 16, marginBottom: 32,
  },
  metaLabel: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  metaValue: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  description: { fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 24, marginBottom: 32 },
  objectiveRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bullet: { width: 8, height: 8, borderRadius: 4, marginRight: 16 },
  objectiveText: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  fabContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingTop: 16,
    backgroundColor: 'rgba(31, 34, 71, 0.9)',
  },
  fab: {
    paddingVertical: 18, borderRadius: 100,
    alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  fabText: { fontSize: 18, fontWeight: '700', color: '#1F2247' },
});