const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// ---------------------------------

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// ---------------------------------

router.get('/', getMovies); // Получение всех фильмов
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?([\W\\\da-z-]{2,200})/).required(),
    trailerLink: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?([\W\\\da-z-]{2,200})/).required(),
    thumbnail: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?([\W\\\da-z-]{2,200})/).required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().pattern(/[а-яё\S\ ]/).required(),
    nameEN: Joi.string().pattern(/[a-z\S\ ]/).required(),
  }),
}), createMovie); // Создание нового фильма
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = { movieRoutes: router };
