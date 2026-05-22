import { Router } from 'express';
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import AppError from '../utils/AppError.js';

const router = Router();

router.use(auth);

// DELETE /api/comments/:commentId — flat route as per API spec
router.delete('/:commentId', async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      isDeleted: false,
    });

    if (!comment) return next(new AppError('Comment not found', 404, 'NOT_FOUND'));

    if (comment.authorId.toString() !== req.user.id) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }

    comment.isDeleted = true;
    await comment.save();

    await Task.findByIdAndUpdate(comment.taskId, { $inc: { commentsCount: -1 } });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
