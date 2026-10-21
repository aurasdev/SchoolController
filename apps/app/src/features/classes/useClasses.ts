import { useCallback, useReducer } from 'react';

import { validateClassInput } from './classCsv';
import { initialClasses } from './content';
import type { AcademicClass, ClassInput } from './types';

type ClassesAction =
  | { type: 'created'; classes: AcademicClass[] }
  | { type: 'updated'; id: string; input: ClassInput };

function classesReducer(state: AcademicClass[], action: ClassesAction): AcademicClass[] {
  switch (action.type) {
    case 'created':
      return [...action.classes, ...state];
    case 'updated':
      return state.map((academicClass) =>
        academicClass.id === action.id ? { ...academicClass, ...action.input } : academicClass
      );
  }
}

let sequence = 0;

function validatedInput(input: ClassInput): ClassInput {
  const normalized = {
    ...input,
    name: input.name.trim(),
    schedule: input.schedule.trim()
  };
  const firstError = Object.values(validateClassInput(normalized))[0];

  if (firstError) throw new Error(firstError);

  return normalized;
}

function newClass(input: ClassInput): AcademicClass {
  sequence += 1;

  return { ...input, id: `class-${Date.now().toString(36)}-${sequence.toString(36)}` };
}

// Keep this hook at the dashboard level so tab navigation preserves local changes.
export function useClasses() {
  const [classes, dispatch] = useReducer(classesReducer, initialClasses);

  const create = useCallback((input: ClassInput) => {
    const academicClass = newClass(validatedInput(input));

    dispatch({ type: 'created', classes: [academicClass] });

    return academicClass.id;
  }, []);

  const update = useCallback((id: string, input: ClassInput) => {
    dispatch({ type: 'updated', id, input: validatedInput(input) });
  }, []);

  const importClasses = useCallback((inputs: ClassInput[]) => {
    const validated = inputs.map(validatedInput);
    const imported = validated.map(newClass);

    if (imported.length > 0) dispatch({ type: 'created', classes: imported });

    return imported.length;
  }, []);

  return { classes, create, update, importClasses };
}

export type ClassesStore = ReturnType<typeof useClasses>;
