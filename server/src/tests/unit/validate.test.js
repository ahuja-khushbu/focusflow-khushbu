import { describe, it, expect, vi } from 'vitest';
import Joi from 'joi';
import validate from '../../middleware/validate.js';

const schema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
});

describe('validate middleware', () => {
  const next = vi.fn();

  it('calls next() with no args when validation passes', () => {
    const req = { body: { name: 'Alice', email: 'alice@test.com' } };
    validate(schema)(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next with VALIDATION_ERROR when required field missing', () => {
    const req = { body: { name: 'Alice' } };
    validate(schema)(req, {}, next);
    const err = next.mock.calls[next.mock.calls.length - 1][0];
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.statusCode).toBe(400);
    expect(err.details).toHaveProperty('email');
  });

  it('includes all field errors when abortEarly is false', () => {
    const req = { body: {} };
    validate(schema)(req, {}, next);
    const err = next.mock.calls[next.mock.calls.length - 1][0];
    expect(err.details).toHaveProperty('name');
    expect(err.details).toHaveProperty('email');
  });

  it('validates query target when specified', () => {
    const querySchema = Joi.object({ page: Joi.number().min(1).required() });
    const req = { query: { page: 'abc' } };
    validate(querySchema, 'query')(req, {}, next);
    const err = next.mock.calls[next.mock.calls.length - 1][0];
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('strips unknown fields', () => {
    const req = { body: { name: 'Bob', email: 'b@test.com', unknown: 'field' } };
    validate(schema)(req, {}, next);
    expect(req.body).not.toHaveProperty('unknown');
  });
});
