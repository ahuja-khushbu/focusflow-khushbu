import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from '../../models/Task.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

const userId = new mongoose.Types.ObjectId();

describe('Task model', () => {
  it('defaults isDeleted to false and commentsCount to 0', async () => {
    const task = await Task.create({ title: 'Test Task', createdBy: userId });
    expect(task.isDeleted).toBe(false);
    expect(task.commentsCount).toBe(0);
  });

  it('defaults status to "todo" and priority to "Medium"', async () => {
    const task = await Task.create({ title: 'Another Task', createdBy: userId });
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('Medium');
  });

  it('accepts any string as status to support custom board column ids', async () => {
    const task = await Task.create({ title: 'Custom Col', createdBy: userId, status: 'my_custom_column' });
    expect(task.status).toBe('my_custom_column');
  });

  it('rejects invalid priority enum', async () => {
    await expect(
      Task.create({ title: 'Bad Priority', createdBy: userId, priority: 'Critical' })
    ).rejects.toThrow();
  });

  it('filters out isDeleted tasks', async () => {
    await Task.create({ title: 'Active', createdBy: userId, isDeleted: false });
    await Task.create({ title: 'Deleted', createdBy: userId, isDeleted: true });

    const tasks = await Task.find({ isDeleted: false });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Active');
  });

  it('requires title', async () => {
    await expect(Task.create({ createdBy: userId })).rejects.toThrow();
  });
});
