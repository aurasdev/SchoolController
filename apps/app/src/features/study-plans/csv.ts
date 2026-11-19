import type { StudyPlanImportInput } from '@school-controller/shared';

import { parseCsvRows } from '@/features/classes/csv';

export const planCsvHeader = 'clave,materia,semestre';

export function parsePlanCsv(source: string): StudyPlanImportInput['subjects'] {
  const rows = parseCsvRows(source);
  const header = rows
    .shift()
    ?.map((value) => value.toLowerCase())
    .join(',');
  if (header !== planCsvHeader) throw new Error(`Usa estos encabezados: ${planCsvHeader}`);
  if (!rows.length) throw new Error('Agrega al menos una materia debajo del encabezado.');
  if (rows.length > 200) throw new Error('Importa como máximo 200 materias a la vez.');
  const seen = new Set<string>();
  return rows.map((values, index) => {
    const [code = '', name = '', semester = ''] = values;
    const line = index + 2;
    if (values.length !== 3 || values.some((value) => !value))
      throw new Error(`Fila ${line}: completa las tres columnas.`);
    const number = Number(semester);
    if (!/^\d+$/.test(semester) || number < 1 || number > 12)
      throw new Error(`Fila ${line}: el semestre debe ser un número de 1 a 12.`);
    const key = code.toUpperCase();
    if (seen.has(key)) throw new Error(`Fila ${line}: la clave ${code} está repetida.`);
    seen.add(key);
    return { code, name, semester: number };
  });
}
