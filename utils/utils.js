const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');

// ---------------------------------

module.exports.checkErrors = (err, res, next) => {
  if (err.name === 'ValidationError') {
    next(new ValidationError('Переданы некорректные данные'));
    return;
  }
  if (err.code === 11000) {
    next(new ConflictError('Запрос конфликтует с текущими данными'));
    return;
  }
  if (err.statusCode === 403 || err.statusCode === 401 || err.statusCode === 404) {
    next(err);
    return;
  }
  next(new InternalServerError('Неизвестная ошибка сервера'));
};

const registration =
{
  "email": "iJerudIk@gmail.com",
  "name": "Алексей",
  "password": "141581g1"
}
const film =
{
  "country": "USA",
  "director": "Todd Phillips",
  "duration": "7320",
  "year": "2019",
  "description": "Какае-то фигня",
  "image": "https://v1.popcornnews.ru/upload/editor/90091335_201554021101625_3735690152843615546_n.jpg",
  "trailerLink": "https://www.youtube.com/watch?v=jGfiPs9zuhE",
  "thumbnail": "https://avatars.mds.yandex.net/get-kinopoisk-image/1946459/84934543-5991-4c93-97eb-beb6186a3ad7/300x450",
  "movieId": "143",
  "nameRU": "Джокер",
  "nameEN": "Joker"
}
