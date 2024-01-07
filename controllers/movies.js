const mongoose = require('mongoose');
const movieModel = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId,
    nameRU, nameEN,
  } = req.body;
  return movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS.CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  movieModel.find({ owner })
    .then((movies) => res.status(HTTP_STATUS.OK).send(movies))
    .catch((err) => {
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params._id)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('У вас нет прав на удаление этого фильма');
      }
      return movieModel.findOneAndDelete({ _id: req.params._id });
    })
    .then((deletedmovie) => {
      res.status(HTTP_STATUS.OK).send(deletedmovie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Фильм с указанным _id не найден'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
