const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// ---------------------------------

const { getCurrentUser, updateUser } = require('../controllers/users');

// ---------------------------------

router.get('/me', getCurrentUser); // Получение текущего пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser); // Обновление данных пользователя

module.exports = { userRoutes: router };
