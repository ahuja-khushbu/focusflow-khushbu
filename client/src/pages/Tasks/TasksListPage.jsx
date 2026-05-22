import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { useTasksQuery, useCreateTask } from '../../hooks/useTasks.js';
import TaskFilters from '../../components/tasks/TaskFilters.jsx';
import TaskForm from '../../components/tasks/TaskForm.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import { PriorityBadge, DueDateBadge } from '../../components/ui/Badge.jsx';
import TagPill from '../../components/ui/TagPill.jsx';

const SORT_FIELDS = {
  createdAt: 'createdAt',
  dueDate: 'dueDate',
  priority: 'priority',
  title: 'title',
};

const STATUS_LABEL = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const StatusDot = ({ status }) => {
  const colors = {
    todo: 'bg-text-muted',
    in_progress: 'bg-copper',
    done: 'bg-success',
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[status] ?? 'bg-text-muted'}`} />
      <span className="text-text-secondary text-sm">
        {STATUS_LABEL[status] ?? status}
      </span>
    </span>
  );
};

const SortHeader = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer select-none hover:text-text-primary transition-colors"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sortDir === 'asc' ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />
        ) : (
          <ArrowDown size={12} className="opacity-30" />
        )}
      </span>
    </th>
  );
};

const TasksListPage = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [showCreate, setShowCreate] = useState(false);

  const sort = `${sortField}:${sortDir}`;
  const { data, isLoading } = useTasksQuery({ limit: 100, sort });
  const createTask = useCreateTask();

  const tasks = data?.data || [];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleCreate = (formData) => {
    createTask.mutate(formData, { onSuccess: () => setShowCreate(false) });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} weight="bold" />
            New Task
          </Button>
        </div>

        <div className="mb-5">
          <TaskFilters />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started"
            action={<Button onClick={() => setShowCreate(true)}>Create task</Button>}
          />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-warm border-b border-border-warm">
                  <tr>
                    <SortHeader label="Title" field="title" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortHeader label="Priority" field="priority" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                    <SortHeader label="Due Date" field="dueDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Tags</th>
                    <SortHeader label="Created" field="createdAt" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm">
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="hover:bg-surface-warm cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary max-w-xs">
                        <span className="line-clamp-1">{task.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusDot status={task.status} />
                      </td>
                      <td className="px-4 py-3">
                        <DueDateBadge dueDate={task.dueDate} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {task.tags?.map((tag) => (
                            <TagPill key={tag._id} tag={tag} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data?.meta && (
              <div className="px-4 py-3 border-t border-border-warm bg-surface-warm">
                <p className="text-xs text-text-muted">
                  {tasks.length} of {data.meta.totalItems} tasks
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task" size="lg">
        <TaskForm
          onSubmit={handleCreate}
          loading={createTask.isPending}
          submitLabel="Create Task"
        />
      </Modal>
    </div>
  );
};

export default TasksListPage;
