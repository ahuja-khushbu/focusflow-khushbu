import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { useTasksQuery, useCreateTask } from '../../hooks/useTasks.js';
import { useTags } from '../../hooks/useTags.js';
import BoardContainer from '../../components/board/BoardContainer.jsx';
import TaskFilters from '../../components/tasks/TaskFilters.jsx';
import TaskForm from '../../components/tasks/TaskForm.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { classifyDueDate } from '../../lib/utils.js';

const StatWidget = ({ label, value, color }) => (
  <div className="card p-4 text-center">
    <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
    <div className="text-xs text-text-muted uppercase tracking-wide">{label}</div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useTasksQuery({ limit: 100 });
  const { data: tags = [] } = useTags();
  const createTask = useCreateTask();
  const [showCreate, setShowCreate] = useState(false);

  const tasks = data?.data || [];

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
    overdue: tasks.filter((t) => classifyDueDate(t.dueDate) === 'overdue').length,
  };

  const handleCreate = (formData) => {
    createTask.mutate(formData, { onSuccess: () => setShowCreate(false) });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-secondary text-sm mt-0.5">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} weight="bold" />
              New Task
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-6">
            <StatWidget label="Total" value={stats.total} color="text-text-primary" />
            <StatWidget label="To Do" value={stats.todo} color="text-text-secondary" />
            <StatWidget label="In Progress" value={stats.inProgress} color="text-copper" />
            <StatWidget label="Done" value={stats.done} color="text-success" />
            <StatWidget label="Overdue" value={stats.overdue} color="text-error" />
          </div>

          {tags.length > 0 && (
            <div className="card p-4 mb-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                Tasks by Tag
              </h2>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: tag.color + '22',
                      borderColor: tag.color + '66',
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                    <span className="font-bold">{tag.taskCount ?? 0}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <TaskFilters />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Create your first task and it will appear on the board"
              action={<Button onClick={() => setShowCreate(true)}>Create first task</Button>}
            />
          ) : (
            <BoardContainer tasks={tasks} />
          )}
        </div>
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

export default DashboardPage;
