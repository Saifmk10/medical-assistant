import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DashboardHeader } from './DashboardHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useAuth } from '../../context/AuthContext';
import { formatFriendlyDate } from '../../utils/date';
import type { RootStackParamList } from '../../navigation/types';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { patient } = useAuth();
  const { appointments, isLoading, error } = useAppointments();
  const next = appointments[0];
  const openDoctors = (search = '') => navigation.navigate('BookAppointment', { search });
  const openAppointments = () => navigation.navigate('MainTabs', { screen: 'Appointments' });
  const openVoice = () => navigation.navigate('MainTabs', { screen: 'Assistant' });
  const actions = [
    { label: 'Book\nAppointment', image: require('../../../assets/home/book.png'), onPress: () => openDoctors() },
    { label: 'Cancel\nAppointment', image: require('../../../assets/home/cancel.png'), onPress: openAppointments },
    { label: 'Check\nAvailability', icon: 'calendar-outline' as const, onPress: () => openDoctors() },
    { label: 'View\nAppointments', image: require('../../../assets/home/appointments.png'), onPress: openAppointments },
    { label: 'Explore\nDoctors', icon: 'person-add-outline' as const, onPress: () => openDoctors() },
    { label: 'My\nHistory', image: require('../../../assets/home/history.png'), onPress: () => navigation.navigate('MainTabs', { screen: 'History' }) },
  ];

  return (
    <LinearGradient colors={['#E3EEFF', '#F5F9FC', '#F5F9FC']} locations={[0, 0.42, 1]} style={styles.background}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <DashboardHeader
            name={patient?.name ?? 'there'}
            onProfile={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            onVoice={openVoice}
            onSearch={openDoctors}
          />

          <View style={styles.appointmentSection}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Upcoming appointment</Text>
              <Pressable accessibilityRole="button" onPress={openAppointments}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>
            <Pressable accessibilityRole="button" onPress={next
              ? () => navigation.navigate('AppointmentDetail', { appointmentId: next.id })
              : openAppointments}>
              <LinearGradient colors={['#3B8CF2', '#1F66D0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.appointment}>
                <View style={styles.decorOne} />
                <View style={styles.decorTwo} />
                {isLoading ? <ActivityIndicator color="#FFFFFF" /> : next ? (
                  <>
                    <View style={styles.doctorRow}>
                      <View style={styles.doctorAvatar}>
                        <Text style={styles.doctorInitials}>{next.doctor.name.replace(/^Dr\.?\s*/i, '').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Text>
                      </View>
                      <View style={styles.doctorText}>
                        <Text style={styles.doctorName} numberOfLines={1}>{next.doctor.name}</Text>
                        <Text style={styles.specialty}>{next.doctor.specialty}</Text>
                      </View>
                      <View style={styles.status}><Text style={styles.statusText}>{next.status}</Text></View>
                    </View>
                    <View style={styles.details}>
                      <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.detailsText}>{formatFriendlyDate(next.date)} · {next.startTime}</Text>
                      <Ionicons name="location-outline" size={16} color="#FFFFFF" />
                      <Text numberOfLines={1} style={[styles.detailsText, styles.location]}>{next.location}</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyAppointment}>
                    <Ionicons name="calendar-outline" size={25} color="#FFFFFF" />
                    <View style={styles.emptyText}>
                      <Text style={styles.doctorName}>{error ? 'Appointments unavailable' : 'No upcoming appointments'}</Text>
                      <Text style={styles.specialty}>{error ?? 'Your next appointment will appear here.'}</Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <LinearGradient colors={['#3B8CF2', '#2A74DE']} style={styles.actionsPanel}>
            <Text style={styles.actionsTitle}>Quick actions</Text>
            <Text style={styles.actionsSubtitle}>What are you looking for today?</Text>
            <View style={styles.grid}>
              {actions.map((action) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={action.label.replace('\n', ' ')}
                  key={action.label}
                  onPress={action.onPress}
                  style={styles.action}
                >
                  {action.image ? <Image source={action.image} style={[styles.actionIcon, action.label === 'My\nHistory' && styles.historyIcon]} resizeMode="contain" /> : (
                    <Ionicons name={action.icon} size={24} color="#1D1B20" />
                  )}
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flexGrow: 1 },
  appointmentSection: { marginHorizontal: 20, marginTop: 18, marginBottom: 18 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 4, marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F2A4A', flexShrink: 1 },
  viewAll: { fontSize: 13, fontWeight: '700', color: '#2F80ED', marginLeft: 8 },
  appointment: {
    minHeight: 130, borderRadius: 24, padding: 16, overflow: 'hidden', justifyContent: 'center',
    shadowColor: '#2F80ED', shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 5,
  },
  decorOne: { position: 'absolute', right: -42, top: -60, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.08)' },
  decorTwo: { position: 'absolute', right: -27, top: 40, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.06)' },
  doctorRow: { flexDirection: 'row', alignItems: 'center' },
  doctorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  doctorInitials: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  doctorText: { flex: 1, marginLeft: 12, marginRight: 6 },
  doctorName: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  specialty: { color: 'rgba(255,255,255,0.9)', fontSize: 12, lineHeight: 17, marginTop: 2 },
  status: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: '#FFFFFF' },
  statusText: { color: '#1E7E48', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  details: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', padding: 12, marginTop: 12, gap: 6 },
  detailsText: { color: '#FFFFFF', fontSize: 12 },
  location: { flex: 1 },
  emptyAppointment: { flexDirection: 'row', alignItems: 'center' },
  emptyText: { flex: 1, marginLeft: 12 },
  actionsPanel: { flex: 1, borderTopLeftRadius: 44, borderTopRightRadius: 44, paddingHorizontal: 30, paddingTop: 22, paddingBottom: 24 },
  actionsTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  actionsSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 20, marginTop: 26 },
  action: { width: '30%', minHeight: 98, borderRadius: 20, backgroundColor: '#F5F9FC', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 10 },
  actionIcon: { width: 24, height: 24 },
  historyIcon: { width: 27, height: 27 },
  actionLabel: { textAlign: 'center', color: '#1D1B20', fontSize: 12, lineHeight: 14, marginTop: 6 },
});
