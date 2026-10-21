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
      onError('Choose a CSV file smaller than 1 MB.');
      return;
    }
    try {
      onRead(await file.text());
    } catch {
      onError('The file could not be read. Please choose it again.');
    }
  }

  return (
    <input
      accept=".csv,text/csv"
      aria-label="Choose CSV file"
      onChange={(event) => void handleChange(event)}
      style={{ color: '#686874', fontFamily: 'inherit', fontSize: 14, maxWidth: '100%' }}
      type="file"
    />
  );
}
