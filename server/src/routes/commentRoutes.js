import { Router } from 'express';
import Joi from 'joi';
import {
  listComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentsController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const commentSchema = Joi.object({
  body: Joi.string().min(1).max(5000).required(),
  parentCommentId: Joi.string().allow(null, '').default(null),
});

const updateSchema = Joi.object({
  body: Joi.string().min(1).max(5000).required(),
});

router.use(auth);

router.get('/:taskId/comments', listComments);
router.post('/:taskId/comments', validate(commentSchema), createComment);
router.patch('/:taskId/comments/:commentId', validate(updateSchema), updateComment);
router.delete('/:taskId/comments/:commentId', deleteComment);

export default router;
