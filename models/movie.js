const mongoose = require('mongoose');
const validator = require('validator');

// ---------------------------------

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: () => 'Неверный формат ссылки на постер',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: () => 'Неверный формат ссылки на трейлер',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: () => 'Неверный формат ссылки на мини-постер',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    pattern: /[а-яё\S ]/gi,
    required: true,
  },
  nameEN: {
    type: String,
    pattern: /[a-z\S ]/gi,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
