/** Tasks without a subject go here. */
export const GENERAL_FOLDER = "כללי";

/** Groups tasks into subject folders: named folders A–Z, then the general one. */
export function byFolder<T extends { subject?: string | null }>(tasks: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const t of tasks) {
    const name = t.subject?.trim() || GENERAL_FOLDER;
    groups.set(name, [...(groups.get(name) ?? []), t]);
  }
  return [...groups].sort(([a], [b]) =>
    a === GENERAL_FOLDER ? 1 : b === GENERAL_FOLDER ? -1 : a.localeCompare(b, "he"),
  );
}
