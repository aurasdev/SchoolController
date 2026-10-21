import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CLASS_CSV_TEMPLATE, parseClassCsv } from '@/features/classes/classCsv';
import { CsvFilePicker } from '@/features/classes/components/CsvFilePicker';
import { classColors } from '@/features/classes/tokens';
import type { ClassInput } from '@/features/classes/types';

type ClassImportProps = {
  onCancel: () => void;
  onImport: (inputs: ClassInput[]) => void;
};

export function ClassImport({ onCancel, onImport }: ClassImportProps) {
  const [source, setSource] = useState('');
  const [error, setError] = useState('');

  function handleRead(value: string) {
    setSource(value);
    setError('');
  }

  function handleSubmit() {
    try {
      const inputs = parseClassCsv(source);
      onImport(inputs);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The CSV could not be imported.');
    }
  }

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        Import Classes
      </Text>
      <Text style={styles.description}>
        Choose a CSV file or paste its contents below. Use an existing department and teacher;
        status must be active or pending.
      </Text>
      <CsvFilePicker onError={setError} onRead={handleRead} />
      <Text style={styles.label}>CSV contents</Text>
      <TextInput
        accessibilityLabel="CSV contents"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={1_000_000}
        multiline
        onChangeText={handleRead}
        placeholder={CLASS_CSV_TEMPLATE}
        placeholderTextColor={classColors.textMuted}
        style={styles.input}
        textAlignVertical="top"
        value={source}
      />
      <Text selectable style={styles.hint}>
        Columns: name,department,teacher,schedule,students,status
      </Text>
      <Pressable
        accessibilityRole="button"
        focusable
        onPress={() => handleRead(CLASS_CSV_TEMPLATE)}
      >
        <Text style={styles.link}>Use example CSV</Text>
      </Pressable>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" focusable onPress={onCancel} style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          focusable
          onPress={handleSubmit}
          style={[styles.button, styles.primaryButton]}
        >
          <Text style={styles.primaryText}>Import Classes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 12
  },
  button: {
    borderColor: classColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  buttonText: { color: classColors.textPrimary, fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: classColors.card,
    borderColor: classColors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
    padding: 24
  },
  description: { color: classColors.textSecondary, fontSize: 14, lineHeight: 22 },
  error: { color: '#b91c1c', fontSize: 14 },
  hint: { color: classColors.textSecondary, fontSize: 12, lineHeight: 20 },
  input: {
    borderColor: classColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: classColors.textPrimary,
    fontSize: 14,
    minHeight: 220,
    padding: 12
  },
  label: { color: classColors.textPrimary, fontSize: 14, fontWeight: '600' },
  link: { alignSelf: 'flex-start', color: classColors.primary, fontSize: 14 },
  primaryButton: { backgroundColor: classColors.primary, borderColor: classColors.primary },
  primaryText: { color: classColors.card, fontSize: 14, fontWeight: '600' },
  title: { color: classColors.textPrimary, fontSize: 24, fontWeight: '700' }
});
