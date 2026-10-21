import type {
  Classroom,
  ClassroomInput,
  ClassroomStatus,
  ClassroomType
} from '@school-controller/shared';
import { useCallback, useState } from 'react';

import { classroomsCopy } from '@/features/classrooms/content';

export type ClassroomFormValues = {
  building: string;
  capacity: string;
  code: string;
  equipment: string;
  status: ClassroomStatus;
  type: ClassroomType;
};

export type ClassroomFormErrors = Partial<Record<'building' | 'capacity' | 'code', string>>;

const emptyValues: ClassroomFormValues = {
  building: '',
  capacity: '',
  code: '',
  equipment: '',
  status: 'available',
  type: 'standard'
};

export function toFormValues(classroom?: Classroom): ClassroomFormValues {
  if (!classroom) {
    return emptyValues;
  }

  return {
    building: classroom.building,
    capacity: String(classroom.capacity),
    code: classroom.code,
    equipment: classroom.equipment.join(', '),
    status: classroom.status,
    type: classroom.type
  };
}

export function validateClassroomForm(
  values: ClassroomFormValues,
  classrooms: Classroom[],
  editingId?: string
): ClassroomFormErrors {
  const errors: ClassroomFormErrors = {};
  const code = values.code.trim().toLowerCase();
  const capacity = values.capacity.trim();

  if (!code) {
    errors.code = classroomsCopy.form.errors.codeRequired;
  } else if (
    classrooms.some(
      (classroom) => classroom.id !== editingId && classroom.code.toLowerCase() === code
    )
  ) {
    errors.code = classroomsCopy.form.errors.codeTaken;
  }

  if (!values.building) {
    errors.building = classroomsCopy.form.errors.buildingRequired;
  }

  if (!/^\d+$/.test(capacity) || Number(capacity) < 1) {
    errors.capacity = classroomsCopy.form.errors.capacityInvalid;
  }

  return errors;
}

export function toClassroomInput(values: ClassroomFormValues): ClassroomInput {
  return {
    building: values.building,
    capacity: Number(values.capacity.trim()),
    code: values.code.trim(),
    equipment: values.equipment
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    status: values.status,
    type: values.type
  };
}

export function useClassroomForm(classrooms: Classroom[], classroom?: Classroom) {
  const [values, setValues] = useState(() => toFormValues(classroom));
  const [errors, setErrors] = useState<ClassroomFormErrors>({});

  const setField = useCallback(
    <K extends keyof ClassroomFormValues>(field: K, value: ClassroomFormValues[K]) => {
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    []
  );

  const onBuildingChange = useCallback(
    (value: string) => {
      setField('building', value);
    },
    [setField]
  );

  const onCapacityChange = useCallback(
    (value: string) => {
      setField('capacity', value);
    },
    [setField]
  );

  const onCodeChange = useCallback(
    (value: string) => {
      setField('code', value);
    },
    [setField]
  );

  const onEquipmentChange = useCallback(
    (value: string) => {
      setField('equipment', value);
    },
    [setField]
  );

  const onStatusChange = useCallback(
    (value: ClassroomStatus) => {
      setField('status', value);
    },
    [setField]
  );

  const onTypeChange = useCallback(
    (value: ClassroomType) => {
      setField('type', value);
    },
    [setField]
  );

  const classroomId = classroom?.id;

  const submit = useCallback((): ClassroomInput | null => {
    const nextErrors = validateClassroomForm(values, classrooms, classroomId);

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0 ? toClassroomInput(values) : null;
  }, [classroomId, classrooms, values]);

  return {
    errors,
    handlers: {
      onBuildingChange,
      onCapacityChange,
      onCodeChange,
      onEquipmentChange,
      onStatusChange,
      onTypeChange
    },
    submit,
    values
  };
}
