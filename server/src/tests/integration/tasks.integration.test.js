import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars';
process.env.NODE_ENV = 'test';

import app from '../../app.js';
import User from '../../models/User.js';
import Task from '../../models/Task.js';

let mongoServer;
let cookies;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register + login
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Bob', email: 'bob@test.com', password: 'password123' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'bob@test.com', password: 'password123' });
  cookies = loginRes.headers['set-cookie'];
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Tasks integration', () => {
  it('POST /api/tasks — creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookies)
      .send({ title: 'My Task', priority: 'High' });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('My Task');
    expect(res.body.data.priority).toBe('High');
  });

  it('POST /api/tasks — 401 without auth', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'No Auth' });
    expect(res.status).toBe(401);
  });

  it('GET /api/tasks — returns paginated list', async () => {
    await request(app).post('/api/tasks').set('Cookie', cookies).send({ title: 'Task 1' });
    await request(app).post('/api/tasks').set('Cookie', cookies).send({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks').set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ page: 1, totalItems: 2 });
  });

  it('GET /api/tasks — filters by status', async () => {
    await request(app).post('/api/tasks').set('Cookie', cookies).send({ title: 'Todo', status: 'todo' });
    await request(app).post('/api/tasks').set('Cookie', cookies).send({ title: 'Done', status: 'done' });

    const res = await request(app).get('/api/tasks?status=done').set('Cookie', cookies);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Done');
  });

  it('GET /api/tasks — searches by title', async () => {
    await request(app).post('/api/tasks').set('Cookie', cookies).send({ title: 'Important meeting' });
    await request(app).post('/api/tasks').set('Cookie', cookies).send({ title: 'Grocery list' });

    const res = await request(app).get('/api/tasks?search=meeting').set('Cookie', cookies);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toContain('meeting');
  });

  it('PATCH /api/tasks/:id — updates task', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookies)
      .send({ title: 'Old title' });
    const id = createRes.body.data._id;

    const res = await request(app)
      .patch(`/api/tasks/${id}`)
      .set('Cookie', cookies)
      .send({ title: 'New title' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('New title');
  });

  it('PATCH /api/tasks/:id/status — updates status only', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookies)
      .send({ title: 'Task' });
    const id = createRes.body.data._id;

    const res = await request(app)
      .patch(`/api/tasks/${id}/status`)
      .set('Cookie', cookies)
      .send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('done');
  });

  it('DELETE /api/tasks/:id — soft deletes (not in list)', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookies)
      .send({ title: 'To Delete' });
    const id = createRes.body.data._id;

    await request(app).delete(`/api/tasks/${id}`).set('Cookie', cookies);

    const listRes = await request(app).get('/api/tasks').set('Cookie', cookies);
    expect(listRes.body.data.find((t) => t._id === id)).toBeUndefined();

    // But still in DB
    const dbTask = await Task.findById(id);
    expect(dbTask.isDeleted).toBe(true);
  });

  it('GET /api/tasks/:id — 404 for deleted task', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookies)
      .send({ title: 'Gone' });
    const id = createRes.body.data._id;

    await request(app).delete(`/api/tasks/${id}`).set('Cookie', cookies);

    const res = await request(app).get(`/api/tasks/${id}`).set('Cookie', cookies);
    expect(res.status).toBe(404);
  });
});
