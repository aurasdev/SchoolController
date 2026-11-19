import { describe, expect, it } from 'vitest';

import { defaultShiftSettings, shiftWarning } from './shift-rules.js';

const enabled = { ...defaultShiftSettings, enabled: true };

describe('shiftWarning', () => {
  it('never warns when the rule is disabled', () => {
    expect(shiftWarning(defaultShiftSettings, 3, 'ISC-3A', '08:00', '09:30')).toBeNull();
  });

  it('warns when a morning semester has a class in the afternoon', () => {
    expect(shiftWarning(enabled, 1, 'ISC-1A', '15:00', '16:30')).toContain('mañana');
    expect(shiftWarning(enabled, 2, 'ISC-2A', '13:30', '15:00')).toContain('08:00–14:30');
  });

  it('accepts morning classes that end exactly when the afternoon starts', () => {
    expect(shiftWarning(enabled, 1, 'ISC-1A', '13:00', '14:30')).toBeNull();
  });

  it('warns when an afternoon semester has a class in the morning or too late', () => {
    expect(shiftWarning(enabled, 5, 'ISC-5A', '08:00', '09:30')).toContain('tarde');
    expect(shiftWarning(enabled, 5, 'ISC-5A', '21:00', '22:30')).toContain('14:30–22:00');
    expect(shiftWarning(enabled, 5, 'ISC-5A', '14:30', '16:00')).toBeNull();
  });

  it('ignores semesters that are in neither list', () => {
    expect(
      shiftWarning({ ...enabled, afternoonSemesters: [5] }, 3, 'ISC-3A', '08:00', '09:30')
    ).toBeNull();
  });
});
