import { Router } from 'express';
import Joi from 'joi';
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  updateStatus,
  deleteTask,
} from '../controllers/tasksController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(10000).allow('').default(''),
  priority: Joi.string().valid('High', 'Medium', 'Low').default('Medium'),
  status: Joi.string().max(100).default('todo'),
  dueDate: Joi.date().allow(null).default(null),
  tags: Joi.array().items(Joi.string()).default([]),
  boardId: Joi.string().allow(null, '').default(null),
  categoryId: Joi.string().allow(null, '').default(null),
  assignedTo: Joi.string().allow(null, '').default(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(10000).allow(''),
  priority: Joi.string().valid('High', 'Medium', 'Low'),
  status: Joi.string().max(100),
  dueDate: Joi.date().allow(null),
  tags: Joi.array().items(Joi.string()),
  boardId: Joi.string().allow(null, ''),
  categoryId: Joi.string().allow(null, ''),
  assignedTo: Joi.string().allow(null, ''),
}).min(1);

const updateStatusSchema = Joi.object({
  status: Joi.string().max(100).required(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().default('createdAt:desc'),
  status: Joi.string().max(100),
  tags: Joi.string(),
  priority: Joi.string().valid('High', 'Medium', 'Low'),
  search: Joi.string().max(200),
  boardId: Joi.string().max(100),
});

router.use(auth);

router.get('/', validate(listQuerySchema, 'query'), listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:id', getTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);
router.delete('/:id', deleteTask);

export default router;
