const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const classifyDueDate = (dueDate) => {
  if (!dueDate) return 'none';
  const now = Date.now();
  const due = new Date(dueDate).getTime();
  if (due < now) return 'overdue';
  if (due <= now + FORTY_EIGHT_HOURS) return 'due-soon';
  return 'normal';
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const priorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'text-error bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900';
    case 'Medium':
      return 'text-warning bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-900';
    case 'Low':
      return 'text-success bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900';
    default:
      return 'text-text-muted bg-surface-warm border-border-warm';
  }
};

export const dueDateColor = (classification) => {
  switch (classification) {
    case 'overdue':
      return 'text-error bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900';
    case 'due-soon':
      return 'text-warning bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-900';
    case 'normal':
      return 'text-success bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900';
    default:
      return '';
  }
};
