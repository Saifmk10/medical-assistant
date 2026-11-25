import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface DashboardHeaderProps {
  name: string;
  onProfile: () => void;
  onVoice: () => void;
  onSearch: (query: string) => void;
}

export function DashboardHeader({ name, onProfile, onVoice, onSearch }: DashboardHeaderProps) {
  const [query, setQuery] = useState('');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = name.trim().split(/\s+/)[0] || 'there';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <LinearGradient colors={['#3B8CF2', '#1F66D0']} style={styles.brand}>
          <Text style={styles.brandText}>M</Text>
        </LinearGradient>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => Alert.alert('Notifications', 'Notifications are not available yet.')}
            style={styles.notification}
          >
            <Ionicons name="notifications-outline" size={20} color="#0F2A4A" />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={onProfile} style={styles.avatar}>
            <Ionicons name="person-outline" size={23} color="#4F378A" />
          </Pressable>
        </View>
      </View>
      <Text style={styles.greeting}>{greeting}, {firstName}</Text>
      <Text style={styles.subtitle}>Your health, all in one place.</Text>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={19} color="#7B8AA0" />
        <TextInput
          accessibilityLabel="Search doctors or specialties"
          placeholder="Search doctors or specialties"
          placeholderTextColor="#7B8AA0"
          returnKeyType="search"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => onSearch(query.trim())}
          style={styles.searchInput}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Open voice assistant" onPress={onVoice} style={styles.voice}>
          <Image source={require('../../../assets/home/voice-search.png')} style={styles.voiceIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 4 },
  brand: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2F80ED', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  brandText: { color: '#FFFFFF', fontSize: 22, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notification: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EADDFF',
    alignItems: 'center', justifyContent: 'center',
  },
  greeting: { marginTop: 16, marginHorizontal: 4, color: '#0F2A4A', fontSize: 26, lineHeight: 34, fontWeight: '700' },
  subtitle: { marginTop: 4, marginHorizontal: 4, color: '#5B6B7F', fontSize: 14, lineHeight: 18 },
  search: {
    marginTop: 14, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', paddingLeft: 16, paddingRight: 8,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#103459', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  searchInput: { flex: 1, minWidth: 0, fontSize: 14, color: '#0F2A4A', marginLeft: 10, paddingVertical: 0 },
  voice: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E7F0FF', alignItems: 'center', justifyContent: 'center' },
  voiceIcon: { width: 16, height: 16 },
});
