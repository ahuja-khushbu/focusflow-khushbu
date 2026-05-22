import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from '@phosphor-icons/react';
import { useBoards, useAddColumn, useUpdateColumn, useDeleteColumn } from '../../hooks/useBoards.js';
import { useTasksQuery, useCreateTask } from '../../hooks/useTasks.js';
import useFilterStore from '../../store/filterStore.js';
import BoardContainer from '../../components/board/BoardContainer.jsx';
import TaskFilters from '../../components/tasks/TaskFilters.jsx';
import TaskForm from '../../components/tasks/TaskForm.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Navbar from '../../components/layout/Navbar.jsx';

const AddColumnModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) { setName(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Column" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Column name</label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="e.g. Review, Blocked..."
            maxLength={100}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={!name.trim()}>Add Column</Button>
        </div>
      </form>
    </Modal>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm" size="sm">
    <p className="text-sm text-text-secondary mb-4">{message}</p>
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm}>Delete</Button>
    </div>
  </Modal>
);

const BoardViewPage = () => {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const { data: boards = [] } = useBoards();
  const board = boards.find((b) => b._id === boardId);

  const addColumn = useAddColumn();
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  const { activeTags, activeStatus, activePriority, searchQuery } = useFilterStore();
  const filterParams = {
    boardId,
    limit: 100,
    ...(activeStatus && { status: activeStatus }),
    ...(activePriority && { priority: activePriority }),
    ...(activeTags.length && { tags: activeTags.join(',') }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data, isLoading } = useTasksQuery(filterParams);
  const createTask = useCreateTask();

  const [showCreate, setShowCreate] = useState(false);
  const [showAddCol, setShowAddCol] = useState(false);
  const [deleteColId, setDeleteColId] = useState(null);

  const tasks = data?.data || [];
  const columns = board?.columns ?? [];

  const handleCreate = (formData) => {
    const defaultColId = columns[0]?.id ?? 'todo';
    createTask.mutate(
      { ...formData, boardId, status: formData.status || defaultColId },
      { onSuccess: () => setShowCreate(false) }
    );
  };

  const handleRenameColumn = (colId, name) => {
    updateColumn.mutate({ boardId, colId, name });
  };

  const handleDeleteColumn = (colId) => setDeleteColId(colId);

  const confirmDelete = () => {
    deleteColumn.mutate({ boardId, colId: deleteColId }, { onSuccess: () => setDeleteColId(null) });
  };

  const handleAddColumn = (name) => {
    addColumn.mutate({ boardId, name }, { onSuccess: () => setShowAddCol(false) });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="px-6 py-6">
        <div className="max-w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/boards')}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-warm transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {board?.name ?? 'Board'}
                </h1>
                {board?.description && (
                  <p className="text-text-secondary text-sm mt-0.5">{board.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAddCol(true)}>
                <Plus size={14} weight="bold" />
                Add Column
              </Button>
              <Button onClick={() => setShowCreate(true)}>
                <Plus size={16} weight="bold" />
                New Task
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <TaskFilters />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : tasks.length === 0 && columns.length === 0 ? (
            <EmptyState
              title="No tasks on this board"
              description="Create your first task and it will appear in the columns"
              action={<Button onClick={() => setShowCreate(true)}>Create first task</Button>}
            />
          ) : (
            <BoardContainer
              tasks={tasks}
              columns={columns}
              onRenameColumn={handleRenameColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          )}
        </div>
      </main>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task" size="lg">
        <TaskForm
          onSubmit={handleCreate}
          loading={createTask.isPending}
          submitLabel="Create Task"
          columns={columns}
        />
      </Modal>

      <AddColumnModal
        isOpen={showAddCol}
        onClose={() => setShowAddCol(false)}
        onSubmit={handleAddColumn}
        loading={addColumn.isPending}
      />

      <ConfirmModal
        isOpen={!!deleteColId}
        onClose={() => setDeleteColId(null)}
        onConfirm={confirmDelete}
        message="Delete this column? Tasks in it will be moved to the first remaining column."
      />
    </div>
  );
};

export default BoardViewPage;
