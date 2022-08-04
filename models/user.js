const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// ---------------------------------

const UnauthorizedError = require('../errors/unauthorized-error');

// ---------------------------------

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Неверный формат почты',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new UnauthorizedError('Неправильная почта или пароль'));

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new UnauthorizedError('Неправильная почта или пароль'));

          return user;
        });
    });
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
