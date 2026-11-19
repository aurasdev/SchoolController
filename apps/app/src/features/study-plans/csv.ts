import type { StudyPlanImportInput } from '@school-controller/shared';

import { parseCsvRows } from '@/features/classes/csv';

export const planCsvHeader = 'clave,materia,semestre,bloque';
const requiredHeader = 'clave,materia,semestre';

/** `bloque` is optional: rows that share a block name are the options of one elective block. */
export function parsePlanCsv(source: string): StudyPlanImportInput['subjects'] {
  const rows = parseCsvRows(source);
  const header = rows
    .shift()
    ?.map((value) => value.toLowerCase())
    .join(',');
  if (header !== requiredHeader && header !== planCsvHeader)
    throw new Error(`Usa estos encabezados: ${planCsvHeader} (bloque es opcional).`);
  if (!rows.length) throw new Error('Agrega al menos una materia debajo del encabezado.');
  if (rows.length > 200) throw new Error('Importa como máximo 200 materias a la vez.');
  const seen = new Set<string>();
  const blockSemesters = new Map<string, number>();
  return rows.map((values, index) => {
    const [code = '', name = '', semester = '', block = ''] = values;
    const line = index + 2;
    if (values.length > header.split(',').length || [code, name, semester].some((value) => !value))
      throw new Error(`Fila ${line}: completa clave, materia y semestre.`);
    const number = Number(semester);
    if (!/^\d+$/.test(semester) || number < 1 || number > 12)
      throw new Error(`Fila ${line}: el semestre debe ser un número de 1 a 12.`);
    const key = code.toUpperCase();
    if (seen.has(key)) throw new Error(`Fila ${line}: la clave ${code} está repetida.`);
    seen.add(key);
    if (block) {
      const blockKey = block.toLowerCase();
      const known =
        blockSemesters.get(blockKey) ?? blockSemesters.set(blockKey, number).get(blockKey);
      if (known !== number)
        throw new Error(
          `Fila ${line}: las materias del bloque ${block} deben ser del mismo semestre.`
        );
    }
    return { code, name, semester: number, ...(block ? { block } : {}) };
  });
}
