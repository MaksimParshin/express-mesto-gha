const User = require("../models/user");
const {
  STATUS_OK, STATUS_CREATED,
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_INCORRECT_DATA).send({ message: "Bed requiest" });
      } else {
        return res.status(ERROR_DEFAULT).send({
          message: "Internal server error",
        });
      }
    });
};

const getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_INCORRECT_DATA).send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res.status(ERROR_NOT_FOUND).send({ message: "Object not found" });
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
        return res.status(ERROR_INCORRECT_DATA).send({ message: "Bed requiest" });
      } else if (err.name === "CastError") {
        return res.status(ERROR_NOT_FOUND).send({ message: "Object not found" });
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
        return res.status(ERROR_INCORRECT_DATA).send({ message: "Bed requiest" });
      } else if (err.name === "CastError") {
        return res.status(ERROR_NOT_FOUND).send({ message: "Object not found" });
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
};
