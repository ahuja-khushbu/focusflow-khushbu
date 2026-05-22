import { cn } from '../../lib/utils.js';
import { priorityColor, dueDateColor, formatDate, classifyDueDate } from '../../lib/utils.js';

export const PriorityBadge = ({ priority }) => (
  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', priorityColor(priority))}>
    {priority}
  </span>
);

export const DueDateBadge = ({ dueDate }) => {
  if (!dueDate) return null;
  const cls = classifyDueDate(dueDate);
  const label = cls === 'overdue' ? `Overdue · ${formatDate(dueDate)}` : formatDate(dueDate);
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', dueDateColor(cls))}>
      {label}
    </span>
  );
};
