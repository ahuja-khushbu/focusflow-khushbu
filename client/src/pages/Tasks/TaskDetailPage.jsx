import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks.js';
import TaskForm from '../../components/tasks/TaskForm.jsx';
import MarkdownViewer from '../../components/markdown/MarkdownViewer.jsx';
import CommentThread from '../../components/comments/CommentThread.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { PriorityBadge, DueDateBadge } from '../../components/ui/Badge.jsx';
import TagPill from '../../components/ui/TagPill.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: task, isLoading } = useTask(id);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleUpdate = (formData) => {
    updateTask.mutate({ id, ...formData }, { onSuccess: () => setShowEdit(false) });
  };

  const handleDelete = () => {
    deleteTask.mutate(id, { onSuccess: () => navigate('/tasks') });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
  }

  if (!task) {
    return <div className="flex items-center justify-center min-h-screen text-text-muted">Task not found</div>;
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-4">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-copper transition-colors"
          >
            <ArrowLeft size={16} />
            Back to tasks
          </Link>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-text-primary flex-1">{task.title}</h1>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>Delete</Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
              task.status === 'done' ? 'bg-green-50 text-success border-green-200' :
              task.status === 'in_progress' ? 'bg-orange-50 text-warning border-orange-200' :
              'bg-surface-warm text-text-secondary border-border-warm'
            }`}>
              {task.status === 'in_progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
            </span>
            <PriorityBadge priority={task.priority} />
            <DueDateBadge dueDate={task.dueDate} />
            {task.tags?.map((tag) => <TagPill key={tag._id} tag={tag} />)}
          </div>

          {task.description ? (
            <MarkdownViewer content={task.description} />
          ) : (
            <p className="text-text-muted text-sm italic">No description</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Comments ({task.commentsCount})
          </h2>
          <CommentThread taskId={id} currentUser={user} />
        </div>
      </main>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Task" size="lg">
        <TaskForm
          defaultValues={{
            ...task,
            tags: task.tags?.map((t) => t._id) || [],
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          }}
          onSubmit={handleUpdate}
          loading={updateTask.isPending}
          submitLabel="Save Changes"
        />
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Task">
        <p className="text-text-secondary mb-4">
          Are you sure you want to delete "<strong>{task.title}</strong>"? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" loading={deleteTask.isPending} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetailPage;
