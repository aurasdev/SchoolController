import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { styles } from '@/features/classes/components/ClassEditor';
import type { ClassInput } from '@/features/classes/content';
import { csvHeader, parseClassesCsv } from '@/features/classes/csv';

type Props = { onClose: () => void; onImport: (items: ClassInput[]) => void };

export function CsvImport({ onClose, onImport }: Props) {
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    try {
      onImport(parseClassesCsv(csv));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to import this CSV.');
    }
  };
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal
          accessibilityLabel="Import CSV"
          style={styles.card}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              Import CSV
            </Text>
            <Text style={styles.subtitle}>
              Paste your CSV including the column headers below. Status must be Active or Pending.
            </Text>
            <Text selectable style={localStyles.example}>
              {csvHeader}
            </Text>
            <TextInput
              accessibilityLabel="CSV content"
              autoFocus
              multiline
              value={csv}
              onChangeText={setCsv}
              placeholder={`${csvHeader}\nMathematics 101,Science & Math,Mr. Johnson,Mon/Wed 08:00,32,Active`}
              placeholderTextColor={colors.textSecondary}
              style={localStyles.input}
            />
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={submit}
                style={[styles.button, styles.primary]}
              >
                <Text style={styles.primaryText}>Import Classes</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  example: { color: colors.textSecondary, fontSize: 12, marginTop: 16, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    marginTop: 12,
    color: colors.textPrimary,
    fontSize: 13,
    textAlignVertical: 'top'
  }
});
