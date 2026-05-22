import { useNavigate } from 'react-router-dom';
import { DotsSixVertical, ChatCircle } from '@phosphor-icons/react';
import { PriorityBadge, DueDateBadge } from '../ui/Badge.jsx';
import TagPill from '../ui/TagPill.jsx';
import { classifyDueDate, cn } from '../../lib/utils.js';

const TaskCard = ({ task, className, dragHandleProps }) => {
  const navigate = useNavigate();
  const dueCls = classifyDueDate(task.dueDate);

  return (
    <div
      className={cn(
        'bg-surface rounded-lg border p-4 shadow-sm cursor-pointer group transition-all duration-150',
        dueCls === 'overdue'
          ? 'border-red-200 bg-red-50/30'
          : 'border-border-warm hover:border-copper-light hover:shadow-md',
        className
      )}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-text-primary text-sm line-clamp-2 flex-1">{task.title}</h3>
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="text-text-muted hover:text-text-secondary cursor-grab opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsSixVertical size={16} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <PriorityBadge priority={task.priority} />
        <DueDateBadge dueDate={task.dueDate} />
        {task.tags?.map((tag) => (
          <TagPill key={tag._id} tag={tag} />
        ))}
      </div>

      {task.commentsCount > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-text-muted">
          <ChatCircle size={14} />
          {task.commentsCount}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
