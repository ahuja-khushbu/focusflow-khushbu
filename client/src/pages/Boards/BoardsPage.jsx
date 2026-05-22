import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, SquaresFour, Trash } from '@phosphor-icons/react';
import { useBoards, useCreateBoard, useDeleteBoard } from '../../hooks/useBoards.js';
import Navbar from '../../components/layout/Navbar.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const BoardForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Board name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="e.g. Product Roadmap"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          placeholder="Optional"
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading} disabled={!name.trim()}>
          Create Board
        </Button>
      </div>
    </form>
  );
};

const BoardsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: boards = [], isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = (data) => {
    createBoard.mutate(data, { onSuccess: () => setShowCreate(false) });
  };

  const handleDelete = (e, boardId) => {
    e.stopPropagation();
    if (window.confirm('Delete this board? Tasks will not be deleted.')) {
      deleteBoard.mutate(boardId);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Boards</h1>
              <p className="text-text-secondary text-sm mt-0.5">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} weight="bold" />
              New Board
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-warm mb-4">
                <SquaresFour size={32} className="text-text-muted" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">No boards yet</h2>
              <p className="text-text-secondary text-sm mb-4">Create a board to start organizing your tasks</p>
              <Button onClick={() => setShowCreate(true)}>Create first board</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => navigate(`/boards/${board._id}`)}
                  className="card p-5 cursor-pointer hover:border-copper-light hover:shadow-md transition-all duration-150 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-copper/10 flex items-center justify-center flex-shrink-0">
                        <SquaresFour size={18} className="text-copper" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-text-primary truncate">{board.name}</h3>
                        {board.description && (
                          <p className="text-xs text-text-muted truncate mt-0.5">{board.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, board._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-muted hover:text-error transition-all"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Board">
        <BoardForm onSubmit={handleCreate} loading={createBoard.isPending} />
      </Modal>
    </div>
  );
};

export default BoardsPage;
