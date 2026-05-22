import { randomUUID } from 'crypto';
import Board from '../models/Board.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

const DEFAULT_COLUMNS = [
  { id: 'todo', name: 'To Do', order: 0 },
  { id: 'in_progress', name: 'In Progress', order: 1 },
  { id: 'done', name: 'Done', order: 2 },
];

export const listBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json({ data: boards });
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const board = await Board.create({
      name,
      description,
      userId: req.user.id,
      columns: DEFAULT_COLUMNS,
    });
    res.status(201).json({ data: board });
  } catch (err) {
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name: req.body.name, description: req.body.description },
      { new: true, runValidators: true }
    );
    if (!board) return next(new AppError('Board not found', 404, 'NOT_FOUND'));
    res.json({ data: board });
  } catch (err) {
    next(err);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!board) return next(new AppError('Board not found', 404, 'NOT_FOUND'));
    await Task.updateMany({ boardId: req.params.id }, { $unset: { boardId: '' } });
    res.json({ message: 'Board deleted' });
  } catch (err) {
    next(err);
  }
};

export const addColumn = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.user.id });
    if (!board) return next(new AppError('Board not found', 404, 'NOT_FOUND'));

    if (board.columns.length === 0) {
      board.columns.push(...DEFAULT_COLUMNS);
    }
    const newCol = { id: randomUUID(), name: req.body.name, order: board.columns.length };
    board.columns.push(newCol);
    await board.save();
    res.status(201).json({ data: board });
  } catch (err) {
    next(err);
  }
};

export const updateColumn = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.user.id });
    if (!board) return next(new AppError('Board not found', 404, 'NOT_FOUND'));

    const col = board.columns.find((c) => c.id === req.params.colId);
    if (!col) return next(new AppError('Column not found', 404, 'NOT_FOUND'));

    col.name = req.body.name;
    await board.save();
    res.json({ data: board });
  } catch (err) {
    next(err);
  }
};

export const deleteColumn = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.user.id });
    if (!board) return next(new AppError('Board not found', 404, 'NOT_FOUND'));
    if (board.columns.length <= 1)
      return next(new AppError('Cannot delete the last column', 400, 'LAST_COLUMN'));

    const colId = req.params.colId;
    const remaining = board.columns.filter((c) => c.id !== colId);
    if (remaining.length === board.columns.length)
      return next(new AppError('Column not found', 404, 'NOT_FOUND'));

    const fallbackId = remaining[0].id;
    await Task.updateMany(
      { boardId: board._id, status: colId },
      { status: fallbackId }
    );

    board.columns = remaining;
    await board.save();
    res.json({ data: board });
  } catch (err) {
    next(err);
  }
};
