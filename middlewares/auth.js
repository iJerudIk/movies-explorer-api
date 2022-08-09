const jwt = require('jsonwebtoken');

// ---------------------------------

const UnauthorizedError = require('../errors/unauthorized-error');
const { DEV_JWT_KEY } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

// ---------------------------------

const handleAuthError = () => {
  throw new UnauthorizedError('Необходима авторизация');
};

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) next(handleAuthError());
  else {
    let payload;

    try {
      payload = jwt.verify(
        token,
        `${NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_KEY}`,
      );
    } catch (err) { next(handleAuthError()); }

    req.user = payload;
    next();
  }
};
