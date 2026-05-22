import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PencilSimple, Trash, Check, X } from '@phosphor-icons/react';
import BoardCard from './BoardCard.jsx';
import { cn } from '../../lib/utils.js';

const ACCENT_COLORS = [
  'border-t-text-muted',
  'border-t-copper',
  'border-t-success',
  'border-t-blue-400',
  'border-t-purple-400',
  'border-t-pink-400',
];

const BoardColumn = ({ column, tasks, index, onRename, onDelete, canDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== column.name) onRename(column.id, trimmed);
    else setDraft(column.name);
    setEditing(false);
  };

  const cancelRename = () => {
    setDraft(column.name);
    setEditing(false);
  };

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col bg-surface-warm rounded-xl border-t-4 min-h-[500px] transition-colors duration-150',
        accent,
        isOver && 'ring-2 ring-copper ring-inset'
      )}
    >
      <div className="px-4 py-3 border-b border-border-warm">
        <div className="flex items-center justify-between gap-2 group">
          {editing ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                className="flex-1 text-sm font-semibold text-text-primary bg-transparent border-b border-copper outline-none py-0.5"
              />
              <button onClick={commitRename} className="text-success hover:opacity-70">
                <Check size={14} weight="bold" />
              </button>
              <button onClick={cancelRename} className="text-text-muted hover:opacity-70">
                <X size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-text-primary text-sm truncate">{column.name}</h2>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => { setDraft(column.name); setEditing(true); }}
                  className="p-1 rounded text-text-muted hover:text-text-primary"
                >
                  <PencilSimple size={13} />
                </button>
                {canDelete && (
                  <button
                    onClick={() => onDelete(column.id)}
                    className="p-1 rounded text-text-muted hover:text-error"
                  >
                    <Trash size={13} />
                  </button>
                )}
              </div>
            </>
          )}
          <span className="text-xs font-medium text-text-muted bg-border-warm rounded-full px-2 py-0.5 flex-shrink-0">
            {tasks.length}
          </span>
        </div>
      </div>

      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <BoardCard key={task._id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default BoardColumn;
