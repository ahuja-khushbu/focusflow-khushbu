import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { classifyDueDate } from '../../utils/dateUtils.js';

describe('classifyDueDate', () => {
  const now = new Date('2026-05-21T12:00:00Z');

  beforeEach(() => {
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "none" for null', () => {
    expect(classifyDueDate(null)).toBe('none');
  });

  it('returns "none" for undefined', () => {
    expect(classifyDueDate(undefined)).toBe('none');
  });

  it('returns "overdue" for a past date', () => {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(classifyDueDate(yesterday)).toBe('overdue');
  });

  it('returns "due-soon" for a date within 48h', () => {
    const soonish = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    expect(classifyDueDate(soonish)).toBe('due-soon');
  });

  it('returns "due-soon" at exactly 48h boundary', () => {
    const exactly48h = new Date(now.getTime() + 48 * 60 * 60 * 1000 - 1);
    expect(classifyDueDate(exactly48h)).toBe('due-soon');
  });

  it('returns "normal" for a date beyond 48h', () => {
    const farFuture = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    expect(classifyDueDate(farFuture)).toBe('normal');
  });

  it('accepts ISO string input', () => {
    const iso = new Date(now.getTime() - 1000).toISOString();
    expect(classifyDueDate(iso)).toBe('overdue');
  });
});
