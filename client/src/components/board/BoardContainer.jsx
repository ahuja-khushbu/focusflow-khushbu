import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import BoardColumn from './BoardColumn.jsx';
import TaskCard from '../tasks/TaskCard.jsx';
import { useUpdateTaskStatus } from '../../hooks/useTasks.js';

const DEFAULT_COLUMNS = [
  { id: 'todo', name: 'To Do' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'done', name: 'Done' },
];

const BoardContainer = ({ tasks, columns, onRenameColumn, onDeleteColumn }) => {
  const [activeTask, setActiveTask] = useState(null);
  const updateStatus = useUpdateTaskStatus();

  const cols = columns?.length ? columns : DEFAULT_COLUMNS;
  const colIds = cols.map((c) => c.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getTasksByColumn = (colId) => tasks.filter((t) => t.status === colId);

  const onDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t._id === active.id) || null);
  };

  const onDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const task = tasks.find((t) => t._id === active.id);
    if (!task) return;

    const targetStatus = colIds.includes(over.id)
      ? over.id
      : tasks.find((t) => t._id === over.id)?.status;

    if (targetStatus && targetStatus !== task.status) {
      updateStatus.mutate({ id: task._id, status: targetStatus });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {cols.map((col, i) => (
          <div key={col.id} className="flex-shrink-0 w-72">
            <BoardColumn
              column={col}
              tasks={getTasksByColumn(col.id)}
              index={i}
              onRename={onRenameColumn}
              onDelete={onDeleteColumn}
              canDelete={cols.length > 1}
            />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} className="rotate-2 shadow-xl opacity-90" /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardContainer;
