// =============================================================
// navigation/types.ts — route param lists for type-safe navigation
// -------------------------------------------------------------
import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Dashboard: undefined;
  Assistant: undefined;
  Appointments: undefined;
  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  BookAppointment: { specialty?: string } | undefined;
  AppointmentDetail: { appointmentId: string };
  RescheduleAppointment: { appointmentId: string };
};

declare global {
  // Lets `useNavigation()` infer types without passing generics everywhere.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
