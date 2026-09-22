// =============================================================
// navigation/RootNavigator.tsx — top-level stack (auth + modals)
// -------------------------------------------------------------
// Login sits outside the tab bar. Booking/Reschedule/Detail screens
// are pushed on top of the tabs as full-screen stack routes.
// =============================================================
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { MainTabs } from './MainTabs';
import { BookAppointmentScreen } from '../screens/booking/BookAppointmentScreen';
import { AppointmentDetailScreen } from '../screens/appointments/AppointmentDetailScreen';
import { RescheduleAppointmentScreen } from '../screens/appointments/RescheduleAppointmentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="BookAppointment"
            component={BookAppointmentScreen}
            options={{ title: 'Book Appointment' }}
          />
          <Stack.Screen
            name="AppointmentDetail"
            component={AppointmentDetailScreen}
            options={{ title: 'Appointment Details' }}
          />
          <Stack.Screen
            name="RescheduleAppointment"
            component={RescheduleAppointmentScreen}
            options={{ title: 'Reschedule' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
