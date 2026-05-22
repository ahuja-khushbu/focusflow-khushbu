import User from '../models/User.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const issueTokens = (res, user) => {
  const payload = { sub: user._id.toString(), email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError('Email already in use', 409, 'EMAIL_IN_USE'));
    }

    const user = await User.create({ name, email, password });
    const { refreshToken } = issueTokens(res, user);

    user.refreshTokens.push(hashToken(refreshToken));
    await user.save();

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'));
    }

    const { refreshToken } = issueTokens(res, user);

    user.refreshTokens.push(hashToken(refreshToken));
    await user.save();

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next(new AppError('No refresh token', 401, 'UNAUTHORIZED'));
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return next(new AppError('Invalid refresh token', 401, 'TOKEN_INVALID'));
    }

    const hashed = hashToken(token);
    const user = await User.findById(decoded.sub);

    if (!user) {
      return next(new AppError('User not found', 401, 'UNAUTHORIZED'));
    }

    if (!user.refreshTokens.includes(hashed)) {
      // Reuse detection — clear all sessions
      user.refreshTokens = [];
      await user.save();
      return next(new AppError('Refresh token reuse detected', 401, 'TOKEN_REUSE'));
    }

    // Rotate: remove old, add new
    user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
    const { refreshToken: newRefresh } = issueTokens(res, user);
    user.refreshTokens.push(hashToken(newRefresh));
    await user.save();

    res.json({ message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const hashed = hashToken(token);
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { refreshTokens: hashed },
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return next(new AppError('User not found', 404, 'NOT_FOUND'));
    }
    const { password, refreshTokens, ...safeUser } = user;
    res.json({ data: safeUser });
  } catch (err) {
    next(err);
  }
};
