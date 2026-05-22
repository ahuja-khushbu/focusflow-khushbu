const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const classifyDueDate = (dueDate) => {
  if (!dueDate) return 'none';

  const now = Date.now();
  const due = new Date(dueDate).getTime();

  if (due < now) return 'overdue';
  if (due <= now + FORTY_EIGHT_HOURS) return 'due-soon';
  return 'normal';
};
