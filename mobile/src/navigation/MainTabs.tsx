import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import type { MainTabParamList } from './types';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { VoiceAssistantScreen } from '../screens/voice/VoiceAssistantScreen';
import { MyAppointmentsScreen } from '../screens/appointments/MyAppointmentsScreen';
import { MedicalHistoryScreen } from '../screens/history/MedicalHistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const labels: Record<keyof MainTabParamList, string> = {
  Dashboard: 'Home',
  Appointments: 'Appointments',
  Assistant: 'Ask',
  History: 'History',
  Profile: 'Profile',
};

const icons: Record<Exclude<keyof MainTabParamList, 'Assistant'>, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'home-outline',
  Appointments: 'calendar-outline',
  History: 'time-outline',
  Profile: 'person-outline',
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const onHome = state.routes[state.index].name === 'Dashboard';

  return (
    <View style={[styles.barContainer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: onHome ? '#2A74DE' : colors.background }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const name = route.name as keyof MainTabParamList;
          const active = state.index === index;
          const color = active ? '#1765CD' : '#536477';
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!active && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={labels[name]}
              accessibilityState={{ selected: active }}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={styles.tab}
            >
              {name === 'Assistant' ? (
                <View style={styles.assistantCircle}><Ionicons name="mic-outline" size={25} color="#FFFFFF" /></View>
              ) : (
                <View style={[styles.iconWrap, active && styles.activeIcon]}>
                  <Ionicons name={icons[name]} size={24} color={color} />
                </View>
              )}
              <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.label, { color }, active && styles.activeLabel]}>
                {labels[name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Appointments" component={MyAppointmentsScreen} />
      <Tab.Screen name="Assistant" component={VoiceAssistantScreen} />
      <Tab.Screen name="History" component={MedicalHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barContainer: { paddingHorizontal: 16, paddingTop: 22 },
  bar: {
    height: 70, borderRadius: 24, backgroundColor: '#FFFFFF', flexDirection: 'row',
    shadowColor: '#103459', shadowOpacity: 0.13, shadowRadius: 20, shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  iconWrap: { width: 46, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  activeIcon: { backgroundColor: '#E7F0FF' },
  assistantCircle: {
    position: 'absolute', top: -22, width: 60, height: 60, borderRadius: 30, borderWidth: 4,
    borderColor: '#FFFFFF', backgroundColor: '#1765CD', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#103459', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  label: { fontSize: 10.5, lineHeight: 14, marginTop: 4, textAlign: 'center' },
  activeLabel: { fontWeight: '700' },
});
