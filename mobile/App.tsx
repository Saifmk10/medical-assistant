// =============================================================
// App.tsx — application root
// -------------------------------------------------------------
// Mounts, in order: safe-area provider → status bar → context
// providers (Auth, Appointments, VoiceAssistant) → navigation.
// This is the only place providers are wired together; screens
// consume them via the `useAuth()` / `useAppointments()` /
// `useVoiceAssistant()` hooks.
// =============================================================
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { AppointmentsProvider } from './src/context/AppointmentsContext';
import { VoiceAssistantProvider } from './src/context/VoiceAssistantContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppointmentsProvider>
          <VoiceAssistantProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </VoiceAssistantProvider>
        </AppointmentsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

