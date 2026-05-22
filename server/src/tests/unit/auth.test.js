import { describe, it, expect, beforeAll } from 'vitest';

process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars';

import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken } from '../../utils/jwt.js';

describe('JWT utilities', () => {
  const payload = { sub: 'user123', email: 'test@example.com' };

  it('signs and verifies access token', () => {
    const token = signAccessToken(payload);
    expect(token).toBeTruthy();
    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe('user123');
    expect(decoded.email).toBe('test@example.com');
  });

  it('signs and verifies refresh token', () => {
    const token = signRefreshToken(payload);
    expect(token).toBeTruthy();
    const decoded = verifyRefreshToken(token);
    expect(decoded.sub).toBe('user123');
  });

  it('throws on invalid access token', () => {
    expect(() => verifyAccessToken('invalid-token')).toThrow();
  });

  it('throws on invalid refresh token', () => {
    expect(() => verifyRefreshToken('bad.token.here')).toThrow();
  });

  it('hashToken returns deterministic hex string', () => {
    const h1 = hashToken('some-refresh-token');
    const h2 = hashToken('some-refresh-token');
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[a-f0-9]{64}$/);
  });

  it('hashToken differs for different inputs', () => {
    expect(hashToken('token-a')).not.toBe(hashToken('token-b'));
  });
});
