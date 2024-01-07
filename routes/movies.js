const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../models/regex');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regex),
    trailerLink: Joi.string().required().pattern(regex),
    thumbnail: Joi.string().required().pattern(regex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().min(24).max(24).hex()
      .required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
