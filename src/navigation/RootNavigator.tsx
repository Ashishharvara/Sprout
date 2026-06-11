import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from '../screens/SplashScreen/SplashScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen/TaskDetailScreen';
import KidsDrawingActivityScreen from '../screens/TaskDetailScreen/KidsDrawingActivityScreen';
import PopTheBubblesScreen from '../screens/TaskDetailScreen/PopTheBubblesScreen';
import Puzzle from '../screens/Puzzle/Puzzle';
import ScavengerHuntScreen from '../screens/TaskDetailScreen/ScavengerHuntScreen';
import { Task } from '../constants/data';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  TaskDetail: { task: Task };
  KidsDrawingActivity: undefined;
  PopTheBubbles: undefined;
  Puzzle: undefined;
  ScavengerHunt: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        <Stack.Screen name="KidsDrawingActivity" component={KidsDrawingActivityScreen} />
        <Stack.Screen name="PopTheBubbles" component={PopTheBubblesScreen} />
        <Stack.Screen name="Puzzle" component={Puzzle} />
        <Stack.Screen 
          name="ScavengerHunt" 
          component={ScavengerHuntScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
