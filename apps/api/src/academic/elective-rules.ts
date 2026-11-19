import type { ElectiveOption, ShiftSettings } from '@school-controller/shared';

import { shiftWarning } from './shift-rules.js';

export type ClassSlot = {
  groupId: string;
  subjectId: string;
  day: string;
  /** Zero-padded HH:mm, so plain string comparison orders times correctly. */
  start: string;
  end: string;
  label: string;
};

type RankInput = {
  optionSubjectIds: string[];
  /** Groups that follow the plan and are in the semester of the block. */
  targetGroupIds: string[];
  /** Every scheduled class of the active period. */
  slots: ClassSlot[];
  settings: ShiftSettings;
  semester: number;
};

const order = { fits: 0, shift: 1, conflict: 2, unscheduled: 3 } as const;

/**
 * Ranks the options of an elective block by how well their scheduled classes fit the groups that
 * take the block: no overlap with the groups' other classes first, then inside the semester shift,
 * then fewer overlaps. Options without classes go last.
 */
export function rankElectiveOptions({
  optionSubjectIds,
  targetGroupIds,
  slots,
  settings,
  semester
}: RankInput): ElectiveOption[] {
  const options = new Set(optionSubjectIds);
  const fixed = slots.filter(
    (slot) => targetGroupIds.includes(slot.groupId) && !options.has(slot.subjectId)
  );
  return optionSubjectIds
    .map((subjectId): ElectiveOption => {
      const own = slots.filter((slot) => slot.subjectId === subjectId);
      const conflicts = own.reduce(
        (total, slot) =>
          total +
          fixed.filter((f) => f.day === slot.day && f.start < slot.end && f.end > slot.start)
            .length,
        0
      );
      const outsideShift = own.some(
        (slot) => shiftWarning(settings, semester, '', slot.start, slot.end) !== null
      );
      const fit = !own.length
        ? 'unscheduled'
        : conflicts
          ? 'conflict'
          : outsideShift
            ? 'shift'
            : 'fits';
      return { subjectId, fit, conflicts, slots: own.map((slot) => slot.label) };
    })
    .sort((a, b) => order[a.fit] - order[b.fit] || a.conflicts - b.conflicts);
}
