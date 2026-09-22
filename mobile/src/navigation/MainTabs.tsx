// =============================================================
// navigation/MainTabs.tsx — bottom tab bar for the signed-in patient
// -------------------------------------------------------------
// Tabs map directly to the "Quick Actions" in README.md §16:
// Dashboard, Voice Assistant, My Appointments, Medical History, Profile.
// =============================================================
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import type { MainTabParamList } from './types';

import { DashboardScreen } from '../screens/home/DashboardScreen';
import { VoiceAssistantScreen } from '../screens/voice/VoiceAssistantScreen';
import { MyAppointmentsScreen } from '../screens/appointments/MyAppointmentsScreen';
import { MedicalHistoryScreen } from '../screens/history/MedicalHistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const iconByRoute: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'home-outline',
  Assistant: 'mic-outline',
  Appointments: 'calendar-outline',
  History: 'document-text-outline',
  Profile: 'person-outline',
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconByRoute[route.name as keyof MainTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Assistant" component={VoiceAssistantScreen} options={{ title: 'Assistant' }} />
      <Tab.Screen name="Appointments" component={MyAppointmentsScreen} />
      <Tab.Screen name="History" component={MedicalHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
