import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars';
process.env.NODE_ENV = 'test';

import app from '../../app.js';
import User from '../../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const credentials = { name: 'Alice', email: 'alice@test.com', password: 'password123' };

describe('Auth integration', () => {
  it('POST /api/auth/register — creates user and sets cookies', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(credentials.email);
    expect(res.headers['set-cookie']).toBeTruthy();
  });

  it('POST /api/auth/register — 409 on duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EMAIL_IN_USE');
  });

  it('POST /api/auth/login — valid credentials set cookies', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeTruthy();
    const cookies = res.headers['set-cookie'];
    expect(cookies.some((c) => c.startsWith('accessToken='))).toBe(true);
    expect(cookies.some((c) => c.startsWith('refreshToken='))).toBe(true);
  });

  it('POST /api/auth/login — 401 on wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — returns user when authenticated', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    const cookies = loginRes.headers['set-cookie'];

    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookies);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(credentials.email);
  });

  it('GET /api/auth/me — 401 when not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/refresh — rotates token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    const cookies = loginRes.headers['set-cookie'];
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [refreshCookie]);
    expect(refreshRes.status).toBe(200);
    const newCookies = refreshRes.headers['set-cookie'];
    expect(newCookies.some((c) => c.startsWith('refreshToken='))).toBe(true);
  });

  it('POST /api/auth/refresh — 401 on token reuse', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    const cookies = loginRes.headers['set-cookie'];
    // Extract just name=value (strip path/httpOnly/etc. for supertest compatibility)
    const rawRefreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    const refreshCookie = rawRefreshCookie.split(';')[0];

    // Use it once (rotation)
    const rotateRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [refreshCookie]);
    expect(rotateRes.status).toBe(200);

    // Reuse old token — should be rejected
    const reuseRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [refreshCookie]);
    expect(reuseRes.status).toBe(401);
  });
});
