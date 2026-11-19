import type { AcademicData } from '@school-controller/shared';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { styles } from '@/features/classes/components/ClassEditor';
import type { ClassInput } from '@/features/classes/content';
import { csvHeader, parseClassesCsv } from '@/features/classes/csv';

type Props = {
  data: AcademicData;
  onClose: () => void;
  onImport: (items: ClassInput[]) => Promise<void>;
};

export function CsvImport({ data, onClose, onImport }: Props) {
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const submitting = useRef(false);
  const close = () => {
    if (!submitting.current) onClose();
  };
  const submit = async () => {
    if (submitting.current) return;
    try {
      const items = parseClassesCsv(csv, data);
      submitting.current = true;
      setPending(true);
      setError('');
      await onImport(items);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to import this CSV.');
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };
  return (
    <Modal transparent animationType="fade" onRequestClose={close}>
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
              Pega el CSV con los encabezados siguientes y los códigos del catálogo. Usa días de
              MONDAY a SUNDAY, horas HH:MM y estado Active o Pending. Máximo 100 clases.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: showCatalog }}
              onPress={() => setShowCatalog((value) => !value)}
              style={localStyles.catalogButton}
            >
              <Text style={localStyles.catalogButtonText}>
                {showCatalog ? 'Ocultar códigos disponibles' : 'Ver códigos disponibles'}
              </Text>
            </Pressable>
            {showCatalog ? (
              <ScrollView nestedScrollEnabled style={localStyles.catalog}>
                <Text selectable style={localStyles.example}>
                  Materias: {data.subjects.map((item) => `${item.code} (${item.name})`).join(', ')}
                  {'\n'}Docentes:{' '}
                  {data.teachers.map((item) => `${item.employeeId} (${item.name})`).join(', ')}
                  {'\n'}Grupos: {data.groups.map((item) => item.code).join(', ')}
                  {'\n'}Aulas: {data.classrooms.map((item) => item.code).join(', ')}
                  {'\n'}Horarios: {data.schedules.map((item) => item.name).join(', ')}
                </Text>
              </ScrollView>
            ) : null}
            <Text selectable style={localStyles.example}>
              {csvHeader}
            </Text>
            <TextInput
              accessibilityLabel="CSV content"
              autoFocus
              multiline
              editable={!pending}
              value={csv}
              onChangeText={setCsv}
              placeholder={csvHeader}
              placeholderTextColor={colors.textSecondary}
              style={localStyles.input}
            />
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={pending}
                onPress={close}
                style={[styles.button, pending && styles.disabled]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ busy: pending, disabled: pending }}
                disabled={pending}
                onPress={submit}
                style={[styles.button, styles.primary, pending && styles.disabled]}
              >
                <Text style={styles.primaryText}>{pending ? 'Importando…' : 'Import Classes'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  catalog: {
    maxHeight: 180,
    marginTop: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8
  },
  catalogButton: { alignSelf: 'flex-start', minHeight: 40, justifyContent: 'center', marginTop: 8 },
  catalogButtonText: { color: colors.primary, fontSize: 13, fontWeight: '500' },
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
