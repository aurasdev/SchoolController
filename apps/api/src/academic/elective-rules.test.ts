import { describe, expect, it } from 'vitest';

import { type ClassSlot, rankElectiveOptions } from './elective-rules.js';
import { defaultShiftSettings } from './shift-rules.js';

const slot = (
  subjectId: string,
  day: string,
  start: string,
  end: string,
  groupId = 'g'
): ClassSlot => ({ groupId, subjectId, day, start, end, label: `${subjectId} ${day} ${start}` });
const rank = (slots: ClassSlot[], settings = defaultShiftSettings) =>
  rankElectiveOptions({
    optionSubjectIds: ['volley', 'soccer', 'chess', 'yoga'],
    targetGroupIds: ['g'],
    slots,
    settings,
    semester: 5
  });

describe('rankElectiveOptions', () => {
  const fixed = slot('math', 'MONDAY', '16:00', '17:30');

  it('puts options that do not overlap the group classes first and counts overlaps', () => {
    const result = rank([
      fixed,
      slot('volley', 'MONDAY', '16:30', '18:00'),
      slot('soccer', 'TUESDAY', '16:00', '17:30'),
      slot('chess', 'MONDAY', '14:30', '16:30')
    ]);
    expect(result.map((o) => [o.subjectId, o.fit, o.conflicts])).toEqual([
      ['soccer', 'fits', 0],
      ['volley', 'conflict', 1],
      ['chess', 'conflict', 1],
      ['yoga', 'unscheduled', 0]
    ]);
  });

  it('does not count a clash with another option of the same block', () => {
    const result = rank([
      slot('volley', 'MONDAY', '16:00', '17:30'),
      slot('soccer', 'MONDAY', '16:00', '17:30')
    ]);
    expect(result.find((o) => o.subjectId === 'volley')?.fit).toBe('fits');
  });

  it('ignores classes of groups outside the block and keeps touching times as compatible', () => {
    const result = rank([
      slot('math', 'MONDAY', '16:00', '17:30', 'other'),
      fixed,
      slot('volley', 'MONDAY', '17:30', '19:00')
    ]);
    expect(result[0]).toMatchObject({ subjectId: 'volley', fit: 'fits' });
  });

  it('ranks options outside the semester shift after those that fit, when the rule is on', () => {
    const enabled = { ...defaultShiftSettings, enabled: true };
    const result = rank(
      [slot('soccer', 'FRIDAY', '08:00', '09:30'), slot('volley', 'FRIDAY', '16:00', '17:30')],
      enabled
    );
    expect(result.map((o) => [o.subjectId, o.fit])).toEqual([
      ['volley', 'fits'],
      ['soccer', 'shift'],
      ['chess', 'unscheduled'],
      ['yoga', 'unscheduled']
    ]);
  });
});
