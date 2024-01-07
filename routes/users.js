const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsersMe,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getUsersMe);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = usersRouter;
