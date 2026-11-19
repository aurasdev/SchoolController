import type { ShiftSettings } from '@school-controller/shared';

export const defaultShiftSettings: ShiftSettings = {
  enabled: false,
  morningSemesters: [1, 2],
  afternoonSemesters: [3, 4, 5, 6, 7, 8, 9, 10],
  morningStart: '08:00',
  afternoonStart: '14:30',
  dayEnd: '22:00'
};

function outsideMessage(
  groupCode: string,
  semester: number,
  shift: string,
  from: string,
  to: string
) {
  return `El grupo ${groupCode} (${semester}.º semestre) tiene prioridad de ${shift} (${from}–${to}); esta clase queda fuera de ese horario.`;
}

/**
 * Soft rule: returns a message when a class is outside the shift preferred by its semester.
 * It never rejects the class; callers surface the message as a warning.
 * Times are zero-padded HH:mm, so plain string comparison orders them correctly.
 */
export function shiftWarning(
  settings: ShiftSettings,
  semester: number,
  groupCode: string,
  startTime: string,
  endTime: string
): string | null {
  if (!settings.enabled) return null;
  if (settings.morningSemesters.includes(semester)) {
    return startTime < settings.morningStart || endTime > settings.afternoonStart
      ? outsideMessage(
          groupCode,
          semester,
          'mañana',
          settings.morningStart,
          settings.afternoonStart
        )
      : null;
  }
  if (settings.afternoonSemesters.includes(semester)) {
    return startTime < settings.afternoonStart || endTime > settings.dayEnd
      ? outsideMessage(groupCode, semester, 'tarde', settings.afternoonStart, settings.dayEnd)
      : null;
  }
  return null;
}
