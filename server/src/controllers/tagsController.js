import Tag from '../models/Tag.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';

export const listTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({ userId: req.user.id }).lean();

    const tagIds = tags.map((t) => t._id);
    const counts = await Task.aggregate([
      { $match: { createdBy: req.user.id, isDeleted: false, tags: { $in: tagIds } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
    ]);

    const countMap = counts.reduce((acc, c) => {
      acc[c._id.toString()] = c.count;
      return acc;
    }, {});

    const result = tags.map((t) => ({
      ...t,
      taskCount: countMap[t._id.toString()] || 0,
    }));

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    const existing = await Tag.findOne({ userId: req.user.id, name });
    if (existing) {
      return next(new AppError('Tag name already exists', 409, 'TAG_EXISTS'));
    }

    const tag = await Tag.create({ name, color, userId: req.user.id });
    res.status(201).json({ data: tag });
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!tag) return next(new AppError('Tag not found', 404, 'NOT_FOUND'));

    await Task.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });

    res.json({ message: 'Tag deleted' });
  } catch (err) {
    next(err);
  }
};
