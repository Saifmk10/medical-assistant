// =============================================================
// screens/history/MedicalHistoryScreen.tsx — structured patient history
// -------------------------------------------------------------
// Implements README.md §15 "Medical History" as a simple timeline.
// =============================================================
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { MOCK_MEDICAL_HISTORY } from '../../data/mockPatient';
import { colors, radii, spacing, typography } from '../../theme';
import { formatFriendlyDate } from '../../utils/date';
import type { MedicalHistoryEntry } from '../../types';

const ICON_BY_TYPE: Record<MedicalHistoryEntry['type'], keyof typeof Ionicons.glyphMap> = {
  appointment: 'calendar-outline',
  diagnosis: 'medkit-outline',
  medication: 'medical-outline',
  allergy: 'warning-outline',
  report: 'document-text-outline',
  procedure: 'cut-outline',
};

export function MedicalHistoryScreen() {
  // NOTE: entries are mocked (data/mockPatient.ts). Replace with a
  // GET /patients/{id}/history call once the backend supports it.
  const entries = MOCK_MEDICAL_HISTORY;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Medical History</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name={ICON_BY_TYPE[item.type]} size={18} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              {item.description ? <Text style={styles.entryDescription}>{item.description}</Text> : null}
              <Text style={styles.entryDate}>{formatFriendlyDate(item.date)}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState icon="document-text-outline" title="No history yet" subtitle="Your records will appear here." />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, marginVertical: spacing.sm },
  list: { paddingBottom: spacing.xxl },
  card: { flexDirection: 'row', marginBottom: spacing.sm },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  textWrap: { flex: 1 },
  entryTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  entryDescription: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  entryDate: { ...typography.caption, color: colors.textTertiary, marginTop: 4 },
});
