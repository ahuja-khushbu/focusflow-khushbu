import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

export const listComments = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      createdBy: req.user.id,
      isDeleted: false,
    }).lean();

    if (!task) return next(new AppError('Task not found', 404, 'NOT_FOUND'));

    const comments = await Comment.find({ taskId: req.params.taskId, isDeleted: false })
      .populate('authorId', 'name email avatar')
      .sort({ createdAt: 1 })
      .lean();

    res.json({ data: comments });
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      createdBy: req.user.id,
      isDeleted: false,
    });

    if (!task) return next(new AppError('Task not found', 404, 'NOT_FOUND'));

    const { body, parentCommentId } = req.body;

    if (parentCommentId) {
      const parent = await Comment.findOne({
        _id: parentCommentId,
        taskId: req.params.taskId,
        isDeleted: false,
      });
      if (!parent) return next(new AppError('Parent comment not found', 404, 'NOT_FOUND'));
    }

    const comment = await Comment.create({
      taskId: req.params.taskId,
      authorId: req.user.id,
      body,
      parentCommentId: parentCommentId || null,
    });

    await Task.findByIdAndUpdate(req.params.taskId, { $inc: { commentsCount: 1 } });

    await comment.populate('authorId', 'name email avatar');

    res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      taskId: req.params.taskId,
      isDeleted: false,
    });

    if (!comment) return next(new AppError('Comment not found', 404, 'NOT_FOUND'));

    if (comment.authorId.toString() !== req.user.id) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }

    comment.body = req.body.body;
    await comment.save();
    await comment.populate('authorId', 'name email avatar');

    res.json({ data: comment });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      taskId: req.params.taskId,
      isDeleted: false,
    });

    if (!comment) return next(new AppError('Comment not found', 404, 'NOT_FOUND'));

    if (comment.authorId.toString() !== req.user.id) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }

    comment.isDeleted = true;
    await comment.save();

    await Task.findByIdAndUpdate(req.params.taskId, { $inc: { commentsCount: -1 } });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};
