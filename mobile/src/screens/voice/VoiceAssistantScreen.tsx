import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatBubble } from '../../components/ChatBubble';
import { VoiceWave } from '../../components/VoiceWave';
import { useAuth } from '../../context/AuthContext';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import type { VoiceAssistantState } from '../../types';

const ACCESSIBILITY_STATE_LABEL: Record<VoiceAssistantState, string> = {
  idle: 'Voice assistant is idle.',
  listening: 'Listening to you.',
  processing: 'Getting things ready.',
  responding: 'Assistant is responding.',
};

const STATUS_LABEL: Record<VoiceAssistantState, string> = {
  idle: 'Ready',
  listening: 'Listening',
  processing: 'One moment',
  responding: 'Speaking',
};

export function VoiceAssistantScreen() {
  const { state, messages, inputLevel, outputLevel, toggleListening } = useVoiceAssistant();
  const { patient } = useAuth();
  const [showTranscript, setShowTranscript] = useState(false);
  const listRef = useRef<FlatList>(null);
  const active = state !== 'idle';
  const firstName = patient?.name.trim().split(/\s+/)[0];
  const level = state === 'responding' ? outputLevel : inputLevel;
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
  const caption = state === 'responding' ? lastAssistant?.text : state === 'listening' ? lastUser?.text : undefined;

  // Open the mic as soon as this tab gains focus, and release it when the user navigates away.
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const toggleListeningRef = useRef(toggleListening);
  useEffect(() => { toggleListeningRef.current = toggleListening; }, [toggleListening]);

  useFocusEffect(
    useCallback(() => {
      if (stateRef.current === 'idle') void toggleListeningRef.current();
      return () => {
        if (stateRef.current !== 'idle') void toggleListeningRef.current();
      };
    }, []),
  );

  return (
    <LinearGradient colors={['#E3EEFF', '#F5F9FC', '#F5F9FC']} locations={[0, 0.42, 1]} style={styles.background}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
        <Text accessibilityLiveRegion="polite" style={styles.srOnly}>{ACCESSIBILITY_STATE_LABEL[state]}</Text>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Voice assistant</Text>
            <Text style={styles.subtitle}>Your health, by voice.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showTranscript ? 'Close transcript' : 'Show transcript'}
            onPress={() => setShowTranscript((visible) => !visible)}
            style={styles.roundButton}
          >
            <Ionicons name={showTranscript ? 'close' : 'chatbubble-ellipses-outline'} size={20} color="#0F2A4A" />
          </Pressable>
        </View>

        {showTranscript ? (
          <View style={styles.transcriptPanel}>
            <Text style={styles.transcriptTitle}>Conversation</Text>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ChatBubble message={item} />}
              contentContainerStyle={styles.transcript}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.center}>
            <VoiceWave state={state} level={level} />
            <View style={styles.messageArea}>
              {active ? (
                <>
                  <Text style={styles.status}>{STATUS_LABEL[state]}</Text>
                  {caption ? <Text numberOfLines={4} style={styles.caption}>{caption}</Text> : null}
                </>
              ) : (
                <>
                  <Text style={styles.greeting}>Hello{firstName ? `, ${firstName}` : ''}</Text>
                  <Text style={styles.prompt}>How can I help you today?</Text>
                </>
              )}
            </View>
          </View>
        )}

        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={active ? 'End voice conversation' : 'Start voice conversation'}
            onPress={() => { void toggleListening(); }}
            style={({ pressed }) => [styles.buttonShadow, pressed && styles.pressed]}
          >
            {active ? (
              <View style={[styles.mainButton, styles.stopButton]}>
                <Ionicons name="stop" size={24} color="#E5504E" />
              </View>
            ) : (
              <LinearGradient colors={['#3B8CF2', '#1F66D0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.mainButton}>
                <Ionicons name="mic" size={28} color="#FFFFFF" />
              </LinearGradient>
            )}
          </Pressable>
          <Text style={styles.hint}>{active ? 'Tap to end' : 'Tap to talk'}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  screen: { flex: 1 },
  srOnly: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 },
  header: { paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#0F2A4A', fontSize: 22, lineHeight: 28, fontWeight: '700' },
  subtitle: { color: '#5B6B7F', fontSize: 14, lineHeight: 18, marginTop: 2 },
  roundButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#103459', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  messageArea: { alignItems: 'center', marginTop: 36, minHeight: 110 },
  status: { color: '#2F80ED', fontSize: 13, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  caption: { color: '#0F2A4A', fontSize: 20, lineHeight: 28, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  greeting: { color: '#5B6B7F', fontSize: 16, marginBottom: 8 },
  prompt: { color: '#0F2A4A', fontSize: 28, lineHeight: 36, fontWeight: '700', textAlign: 'center' },
  transcriptPanel: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  transcriptTitle: { color: '#0F2A4A', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  transcript: { paddingVertical: 12, flexGrow: 1, justifyContent: 'flex-end' },
  controls: { alignItems: 'center', paddingBottom: 16, paddingTop: 8 },
  buttonShadow: {
    shadowColor: '#2F80ED', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  mainButton: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  stopButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F6C9C8' },
  pressed: { opacity: 0.8 },
  hint: { color: '#5B6B7F', fontSize: 12, marginTop: 10 },
});
