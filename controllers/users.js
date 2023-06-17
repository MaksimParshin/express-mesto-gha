const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require("../utils/constants");

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
    .catch(next);
};

  //   if (err.name === "ValidationError") {
    //     return res
    //       .status(ERROR_INCORRECT_DATA)
    //       .send({ message: "Bed requiest" });
    //   } else {
    //     return res.status(ERROR_DEFAULT).send({
    //       message: "Internal server error",
    //     });
    //   }

const getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Object not found" });
      } else {
        return res.status(ERROR_DEFAULT).send({
          message: "Internal server error",
        });
      }
    });
};

const updateProfile = (req, res) => {
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
        return res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Bed requiest" });
      } else {
        return res.status(ERROR_DEFAULT).send({
          message: "Internal server error",
        });
      }
    });
};

const updateAvatar = (req, res) => {
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
        return res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Bed requiest" });
      } else {
        return res.status(ERROR_DEFAULT).send({
          message: "Internal server error",
        });
      }
    });
};

const login = (req, res) => {
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
          res.status(403).send({ message: "Неправильные данные для входа" });
        }
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_INCORRECT_DATA)
          .send({ message: "Bed requiest" });
      } else {
        return res.status(ERROR_DEFAULT).send({
          message: "Internal server error",
        });
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
};
