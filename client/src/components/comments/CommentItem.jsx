import { useState } from 'react';
import Avatar from '../ui/Avatar.jsx';
import MarkdownViewer from '../markdown/MarkdownViewer.jsx';
import CommentForm from './CommentForm.jsx';
import Button from '../ui/Button.jsx';
import { useUpdateComment, useDeleteComment, useCreateComment } from '../../hooks/useComments.js';
import { formatDate } from '../../lib/utils.js';

const CommentItem = ({ comment, taskId, currentUser, replies = [] }) => {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const createComment = useCreateComment(taskId);

  const isOwn = comment.authorId?._id === currentUser?._id || comment.authorId?.email === currentUser?.email;

  const handleUpdate = (body) => {
    updateComment.mutate(
      { commentId: comment._id, body },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleReply = (body) => {
    createComment.mutate(
      { body, parentCommentId: comment._id },
      { onSuccess: () => setReplying(false) }
    );
  };

  return (
    <div className="flex gap-3">
      <Avatar user={comment.authorId} size="sm" className="flex-shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-primary">{comment.authorId?.name}</span>
          <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
        </div>

        {editing ? (
          <CommentForm
            defaultValue={comment.body}
            onSubmit={handleUpdate}
            loading={updateComment.isPending}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <MarkdownViewer content={comment.body} className="text-sm" />
        )}

        {!editing && (
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setReplying(!replying)}
              className="text-xs text-text-muted hover:text-copper transition-colors"
            >
              Reply
            </button>
            {isOwn && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-text-muted hover:text-copper transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteComment.mutate(comment._id)}
                  className="text-xs text-text-muted hover:text-error transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {replying && (
          <div className="mt-2">
            <CommentForm
              onSubmit={handleReply}
              loading={createComment.isPending}
              onCancel={() => setReplying(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-border-warm space-y-3">
            {replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                taskId={taskId}
                currentUser={currentUser}
                replies={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
