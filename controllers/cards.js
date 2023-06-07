const Card = require("../models/card");
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require("../utils/constants");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) =>
      res.status(ERROR_DEFAULT).send({
        message: "Internal server error",
      })
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
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

const deleteCardByID = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error("Not Found"))
    .then((card) => res.status(200).send(card))
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.status(200).send(card))
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.status(200).send(card))
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

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard,
};
