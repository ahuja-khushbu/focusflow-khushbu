import { useComments, useCreateComment } from '../../hooks/useComments.js';
import CommentItem from './CommentItem.jsx';
import CommentForm from './CommentForm.jsx';
import Spinner from '../ui/Spinner.jsx';

const CommentThread = ({ taskId, currentUser }) => {
  const { data: comments = [], isLoading } = useComments(taskId);
  const createComment = useCreateComment(taskId);

  const topLevel = comments.filter((c) => !c.parentCommentId);
  const getReplies = (id) =>
    comments.filter((c) => c.parentCommentId?.toString() === id.toString());

  if (isLoading) return <div className="flex justify-center py-4"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <CommentForm
        onSubmit={(body) => createComment.mutate({ body, parentCommentId: null })}
        loading={createComment.isPending}
        placeholder="Add a comment..."
      />

      {topLevel.length > 0 && (
        <div className="space-y-4 divide-y divide-border-warm">
          {topLevel.map((comment) => (
            <div key={comment._id} className="pt-4 first:pt-0">
              <CommentItem
                comment={comment}
                taskId={taskId}
                currentUser={currentUser}
                replies={getReplies(comment._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
