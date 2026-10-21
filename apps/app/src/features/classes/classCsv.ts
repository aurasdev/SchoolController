import { departments, teachers } from './content';
import type { ClassInput, ClassValidationErrors } from './types';

const csvHeaders = ['name', 'department', 'teacher', 'schedule', 'students', 'status'] as const;

export const CLASS_CSV_TEMPLATE =
  'name,department,teacher,schedule,students,status\r\nMathematics 101,Science & Math,Mr. Johnson,Mon/Wed/Fri 08:00,32,active\r\n';

export function validateClassInput(input: ClassInput): ClassValidationErrors {
  const errors: ClassValidationErrors = {};

  if (!input.name.trim()) errors.name = 'Enter the class name.';
  if (!departments.includes(input.department)) errors.department = 'Select a department.';
  if (!teachers.some((teacher) => teacher.id === input.teacherId)) {
    errors.teacherId = 'Select a teacher.';
  }
  if (!input.schedule.trim()) errors.schedule = 'Enter the class schedule.';
  if (!Number.isSafeInteger(input.students) || input.students < 0 || input.students > 10000) {
    errors.students = 'Enter a whole number from 0 to 10,000.';
  }
  if (input.status !== 'active' && input.status !== 'pending') {
    errors.status = 'Select Active or Pending.';
  }

  return errors;
}

type CsvRow = { values: string[]; line: number };

function parseRows(source: string): CsvRow[] {
  const text = source.replace(/^\uFEFF/, '');
  const rows: CsvRow[] = [];
  let row: string[] = [];
  let value = '';
  let quoted = false;
  let closedQuote = false;
  let line = 1;
  let rowLine = 1;

  const finishField = () => {
    row.push(value.trim());
    value = '';
    closedQuote = false;
  };

  const finishRow = () => {
    finishField();
    if (row.some((cell) => cell.length > 0)) rows.push({ line: rowLine, values: row });
    row = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (quoted) {
        if (text[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = false;
          closedQuote = true;
        }
      } else if (!closedQuote && value.trim().length === 0) {
        value = '';
        quoted = true;
      } else {
        throw new Error(`CSV line ${line}: unexpected quotation mark.`);
      }
    } else if (character === '\r' || character === '\n') {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      if (quoted) {
        value += '\n';
      } else {
        finishRow();
      }
      line += 1;
      if (!quoted) rowLine = line;
    } else if (character === ',' && !quoted) {
      finishField();
    } else if (closedQuote) {
      if (character !== ' ' && character !== '\t') {
        throw new Error(`CSV line ${line}: unexpected text after a closing quotation mark.`);
      }
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error(`CSV line ${rowLine}: a quoted field is not closed.`);
  finishRow();

  return rows;
}

// Parse and validate the complete file before the caller updates its store.
export function parseClassCsv(source: string): ClassInput[] {
  const [header, ...rows] = parseRows(source);

  if (!header) throw new Error('The CSV file is empty.');

  const headers = header.values.map((value) => value.toLowerCase());
  if (
    headers.length !== csvHeaders.length ||
    new Set(headers).size !== headers.length ||
    csvHeaders.some((value) => !headers.includes(value))
  ) {
    throw new Error(`CSV headers must be: ${csvHeaders.join(', ')}.`);
  }
  if (rows.length === 0) throw new Error('The CSV file contains no classes.');

  return rows.map(({ line, values }) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV line ${line}: expected ${headers.length} columns.`);
    }

    const field = (name: (typeof csvHeaders)[number]) => values[headers.indexOf(name)];
    const teacherValue = field('teacher').toLowerCase();
    const teacher = teachers.find(
      (option) =>
        option.id.toLowerCase() === teacherValue || option.name.toLowerCase() === teacherValue
    );
    const department = departments.find(
      (option) => option.toLowerCase() === field('department').toLowerCase()
    );
    const students = field('students');
    const status = field('status').toLowerCase();
    const input: ClassInput = {
      name: field('name'),
      department: department ?? field('department'),
      teacherId: teacher?.id ?? '',
      schedule: field('schedule'),
      students: /^\d+$/.test(students) ? Number(students) : Number.NaN,
      status: status as ClassInput['status']
    };
    const errors = validateClassInput(input);
    const firstError = Object.values(errors)[0];

    if (firstError) throw new Error(`CSV line ${line}: ${firstError}`);

    return input;
  });
}
