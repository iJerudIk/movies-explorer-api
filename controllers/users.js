const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---------------------------------

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const { checkErrors } = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

// ---------------------------------

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => { res.send(data); })
    .catch((err) => { checkErrors(err, res, next); });
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (data) res.send(data);
      else throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => { checkErrors(err, res, next); });
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((data) => {
      if (data) res.send(data);
      else throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => { checkErrors(err, res, next); });
};

// ---------------------------------

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((data) => { res.status(201).send(data); })
        .catch((err) => { checkErrors(err, res, next); });
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        `${NODE_ENV === 'production' ? JWT_SECRET : 'op-dev-key'}`,
        { expiresIn: '7d' },
      );
      res.cookie('token', token);
      res.send({ token });
    })
    .catch((err) => { checkErrors(err, res, next); });
};
