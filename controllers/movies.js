const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { checkErrors } = require('../utils/utils');

// ---------------------------------

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((data) => { res.send(data); })
    .catch((err) => { checkErrors(err, res, next); });
};
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ ...req.body, owner })
    .then((data) => { res.status(201).send(data); })
    .catch((err) => { checkErrors(err, res, next); });
};
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Фильм не найден');
      else if (String(movie.owner) === userId) {
        Movie.findByIdAndRemove(movieId)
          .then(() => { res.status(200).send({ message: 'Фильм успешно удален' }); })
          .catch((err) => { checkErrors(err, res, next); });
      } else throw new ForbiddenError('Этот фильм не ваш');
    })
    .catch((err) => { checkErrors(err, res, next); });
};
