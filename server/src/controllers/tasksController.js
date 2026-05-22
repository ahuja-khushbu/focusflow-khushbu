import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

export const listTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'createdAt:desc',
      status,
      tags,
      priority,
      search,
      boardId,
    } = req.query;

    const filter = { createdBy: req.user.id, isDeleted: false };

    if (boardId) filter.boardId = boardId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tags) {
      const tagIds = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagIds.length) filter.tags = { $in: tagIds };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [sortField, sortDir] = sort.split(':');
    const sortObj = { [sortField]: sortDir === 'asc' ? 1 : -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, totalItems] = await Promise.all([
      Task.find(filter)
        .populate('tags', 'name color')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(filter),
    ]);

    res.json({
      data: tasks,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user.id });
    await task.populate('tags', 'name color');
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
      isDeleted: false,
    })
      .populate('tags', 'name color')
      .lean();

    if (!task) return next(new AppError('Task not found', 404, 'NOT_FOUND'));
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).populate('tags', 'name color');

    if (!task) return next(new AppError('Task not found', 404, 'NOT_FOUND'));
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id, isDeleted: false },
      { status },
      { new: true, runValidators: true }
    ).populate('tags', 'name color');

    if (!task) return next(new AppError('Task not found', 404, 'NOT_FOUND'));
    res.json({ data: task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!task) return next(new AppError('Task not found', 404, 'NOT_FOUND'));
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
