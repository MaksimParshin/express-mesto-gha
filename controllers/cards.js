const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) =>
      res.status(500).send({
        message: "Internal server error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) =>
      res.status(500).send({
        message: "Internal server error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const deleteCardByID = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === "Card not found") {
        res.status(404).send({
          message: "Card not found",
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === "Card not found") {
        res.status(404).send({
          message: "Card not found",
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === "Card not found") {
        res.status(404).send({
          message: "Card not found",
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

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard,
};
