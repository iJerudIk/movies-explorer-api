require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

// ---------------------------------

const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login, logout } = require('./controllers/users');
const { limiter } = require('./utils/utils');
const { userRoutes } = require('./routes/users');
const { movieRoutes } = require('./routes/movies');
const { auth } = require('./middlewares/auth');
const { DEV_MONGO_DB } = require('./utils/config');

const { NODE_ENV, PROD_MONGO_DB } = process.env;

// ---------------------------------

const app = express(); // Создание приложения
mongoose.connect(`${NODE_ENV === 'production' ? PROD_MONGO_DB : DEV_MONGO_DB}`); // Подключение к БД

// ---------------------------------

app.use(requestLogger); // Подключение логгера запросов

app.use(bodyParser.json()); // Подключение парсера
app.use(cookieParser()); // Подключение парсера куков
app.use(helmet()); // Настройка заголовков ответа
app.use(limiter); // Подключение лимитера

// ---------------------------------

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signout', logout);

app.use('/users', auth, userRoutes); // Роуты пользователей
app.use('/movies', auth, movieRoutes); // Роуты понравившихся фильмов

// ---------------------------------

app.use('/', auth, (req, res, next) => { next(new NotFoundError('Страница не найдена')); });

app.use(errorLogger); // Подключение логгера ошибок
app.use(errors()); // Ошибки JOI и Celebrate

app.use((err, req, res, next) => {
  res.status(err.statusCode);
  res.send({ message: err.message });
  next();
}); // Централизованный обработчик

// ---------------------------------

app.listen(3000); // Запуск сервера
