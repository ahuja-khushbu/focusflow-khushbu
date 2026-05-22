import { Router } from 'express';
import Joi from 'joi';
import { register, login, refresh, logout, me } from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

export default router;
