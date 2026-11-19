import type { ChangeEvent } from 'react';

type CsvFilePickerProps = {
  onRead: (source: string) => void;
  onError: (message: string) => void;
};

export function CsvFilePicker({ onRead, onError }: CsvFilePickerProps) {
  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    if (file.size > 1_000_000) {
      onError('Elige un archivo CSV de menos de 1 MB.');
      return;
    }
    try {
      onRead(await file.text());
    } catch {
      onError('No se pudo leer el archivo. Elígelo de nuevo.');
    }
  }

  return (
    <input
      accept=".csv,text/csv"
      aria-label="Elegir archivo CSV"
      onChange={(event) => void handleChange(event)}
      style={{ color: '#686874', fontFamily: 'inherit', fontSize: 14, maxWidth: '100%' }}
      type="file"
    />
  );
}
