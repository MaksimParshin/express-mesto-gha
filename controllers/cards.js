const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res.status(404).send({ message: "Object not found" });
      } else {
        return res.status(500).send({
          message: "Internal server error",
        });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res.status(404).send({ message: "Object not found" });
      } else {
        return res.status(500).send({
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res.status(404).send({ message: "Object not found" });
      } else {
        return res.status(500).send({
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res.status(404).send({ message: "Object not found" });
      } else {
        return res.status(500).send({
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Bed requiest" });
      } else if (err.message === "Not Found") {
        return res.status(404).send({ message: "Object not found" });
      } else {
        return res.status(500).send({
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
