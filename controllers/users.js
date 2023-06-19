const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_DEFAULT,
} = require("../utils/constants");
const NotFoundError = require("../middlewares/not-found-err");
const IncorrectDataError = require("../middlewares/incorrect-data-err");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((err) =>
      res.status(ERROR_DEFAULT).send({
        message: "Internal server error",
      })
    );
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      }).then((user) => res.status(STATUS_CREATED).send(user));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new IncorrectDataError("Bed requiest"));
      } else {
        next(err);
      }
    });
};

const getUserByID = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new IncorrectDataError("Bed requiest"));
      } else if (err.message === "Not Found") {
        next(new NotFoundError("Object not found"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new IncorrectDataError("Bed requiest"));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new IncorrectDataError("Bed requiest"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // if (!email || !password) {
  //   res.status(403).send({ message: "Введите данные" });
  //   return;
  // }

  User.findOne({ email })
    .select("+password")
    .orFail(() => {
      new Error("Пользователь с таким email не найден");
    })
    .then((user) => {
      bcrypt.compare(String(password), user.password).then((isValidUser) => {
        if (isValidUser) {
          const jwt = jsonWebToken.sign({ _id: user._id }, "SECRET", {
            expiresIn: "7d",
          });
          res.cookie("jwt", jwt, {
            maxAge: 360000,
            httpOnly: true,
            sameSite: true,
          });
          res.send(user.toJSON());
        } else {
          res.status(401).send({ message: "Неправильные данные для входа" });
        }
      });
    })
};

const currentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(new Error("Not ID"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new IncorrectDataError("Bed requiest"));
      } else if (err.message === "Not Found") {
        next(new NotFoundError("Object not found"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  currentUser,
};
