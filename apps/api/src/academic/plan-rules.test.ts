import { describe, expect, it } from 'vitest';

import { planWarning } from './plan-rules.js';

const base = { groupCode: 'ISC-5A', groupSemester: 5, planName: 'Plan 2020' };

describe('planWarning', () => {
  it('accepts a subject that sits in the semester the group is taking', () => {
    expect(planWarning({ ...base, planSemester: 5 })).toBeNull();
  });

  it('warns when the plan places the subject in another semester', () => {
    const message = planWarning({ ...base, planSemester: 7 });
    expect(message).toContain('7.º semestre');
    expect(message).toContain('ISC-5A');
  });

  it('warns when the plan does not list the subject', () => {
    expect(planWarning({ ...base, planSemester: undefined })).toContain('no forma parte');
  });
});
