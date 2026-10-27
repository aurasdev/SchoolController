import type { ClassInput } from '@/features/classes/content';

export const csvHeader = 'name,department,teacher,schedule,students,status';

export function parseClassesCsv(source: string): ClassInput[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const text = source.replace(/^\uFEFF/, '').trim();
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index++;
      } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (quoted) throw new Error('A quoted CSV value is missing its closing quote.');
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  if (
    rows
      .shift()
      ?.map((value) => value.toLowerCase())
      .join(',') !== csvHeader
  ) {
    throw new Error(`Use these column headers: ${csvHeader}`);
  }
  if (!rows.length) throw new Error('Add at least one class below the header.');
  return rows.map((values, index) => {
    const [name, department, teacher, schedule, students, status] = values;
    if (
      values.length !== 6 ||
      !name ||
      !department ||
      !teacher ||
      !schedule ||
      !/^\d+$/.test(students) ||
      !Number.isSafeInteger(Number(students)) ||
      (status !== 'Active' && status !== 'Pending')
    ) {
      throw new Error(
        `Check row ${index + 2}: all six fields are required, students must be a non-negative integer, and status must be Active or Pending.`
      );
    }
    return { name, department, teacher, schedule, students: Number(students), status };
  });
}
