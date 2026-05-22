import AppError from '../utils/AppError.js';

const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], { abortEarly: false, stripUnknown: true });

  if (error) {
    const details = error.details.reduce((acc, d) => {
      acc[d.path.join('.')] = d.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', details));
  }

  req[target] = value;
  next();
};

export default validate;
