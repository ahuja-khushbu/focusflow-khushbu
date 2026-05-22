import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars';

import auth from '../../middleware/auth.js';
import { signAccessToken } from '../../utils/jwt.js';

const mockNext = vi.fn();
const mockRes = {};

describe('auth middleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });

  it('calls next with UNAUTHORIZED error when no cookie', () => {
    const req = { cookies: {} };
    auth(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledOnce();
    expect(mockNext.mock.calls[0][0].code).toBe('UNAUTHORIZED');
  });

  it('calls next with TOKEN_INVALID for a malformed token', () => {
    const req = { cookies: { accessToken: 'bad.token.here' } };
    auth(req, mockRes, mockNext);
    expect(mockNext.mock.calls[0][0].code).toBe('TOKEN_INVALID');
  });

  it('attaches req.user and calls next() with no error for valid token', () => {
    const token = signAccessToken({ sub: 'abc123', email: 'u@test.com' });
    const req = { cookies: { accessToken: token } };
    auth(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
    expect(req.user).toEqual({ id: 'abc123', email: 'u@test.com' });
  });

  it('calls next with TOKEN_INVALID when token is expired', async () => {
    const jwt = await import('jsonwebtoken');
    const expired = jwt.default.sign(
      { sub: 'abc', email: 'a@b.com' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '0s' }
    );
    await new Promise((r) => setTimeout(r, 10));
    const req = { cookies: { accessToken: expired } };
    auth(req, mockRes, mockNext);
    expect(mockNext.mock.calls[0][0].code).toBe('TOKEN_INVALID');
  });
});
