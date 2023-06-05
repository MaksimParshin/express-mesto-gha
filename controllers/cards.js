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

const getCardByID = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => new Error("User not found"))
    .then((card) => res.status(200).send(card))
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

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) =>
      res.status(500).send({
        message: "Internal server error",
        err: err.message,
        stack: err.stack,
      })
    );
};

module.exports = { getCards, getCardByID, createCard };
