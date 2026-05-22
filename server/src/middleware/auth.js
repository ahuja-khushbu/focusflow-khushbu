import { verifyAccessToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

const auth = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new AppError('Not authenticated', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401, 'TOKEN_INVALID'));
  }
};

export default auth;
