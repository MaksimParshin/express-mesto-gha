const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) =>
      res.status(500).send({
        message: "Internal server error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) =>
      res.status(500).send({
        message: "Internal server error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(500).send({
          message: "Internal server error",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateProfile = (req, res) => {
const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(500).send({
          message: "Internal server error",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(500).send({
          message: "Internal server error",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = { getUsers, getUserByID, createUser, updateProfile, updateAvatar };
