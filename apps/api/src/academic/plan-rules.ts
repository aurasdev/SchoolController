export type PlanCheck = {
  groupCode: string;
  groupSemester: number;
  planName: string;
  /** Semester of the subject inside the group's plan; undefined when the plan does not list it. */
  planSemester: number | undefined;
};

/**
 * Soft rule: a group follows one study plan, and that plan decides which semester each subject
 * belongs to. Returns a message when a class does not match the plan; it never rejects the class.
 */
export function planWarning({
  groupCode,
  groupSemester,
  planName,
  planSemester
}: PlanCheck): string | null {
  if (planSemester === undefined)
    return `La materia no forma parte del ${planName} del grupo ${groupCode}.`;
  if (planSemester !== groupSemester)
    return `En el ${planName} la materia es de ${planSemester}.º semestre, pero el grupo ${groupCode} cursa el ${groupSemester}.º.`;
  return null;
}
