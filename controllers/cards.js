const Card = require("../models/card");
const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_DEFAULT,
} = require("../utils/constants");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) =>
      res.status(ERROR_DEFAULT).send({
        message: "Internal server error",
      })
    );
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new IncorrectDataError("Bed requiest"));
      } else {
        next(err);
      }
    });
};

const deleteCardByID = (req, res, next) => {
  const { _id } = req.user;
  Card.findById(req.params.cardId)
    .orFail(() => new Error("Not ID"))
    .then((card) => {
      if (card.owner.toString() !== _id) {
        return Promise.reject(new Error("Невозможно удалить карточку"));
      }
      return Card.findByIdAndDelete(cardId).then(() =>
        res.send({ message: "Card deleted" })
      );
    })

    .catch((err) => {
      if (err.name === "CastError") {
        next(new IncorrectDataError("Bed requiest"));
      } else if (err.message === "Not ID") {
        next(new NotFoundError("Object not found"));
      } else {
        res.status(ERROR_DEFAULT).send({
          message: "Internal server error",
        });
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new IncorrectDataError("Bed requiest"));
      } else if (err.message === "Not Found") {
        next(new NotFoundError("Object not found"));
      } else {
        res.status(ERROR_DEFAULT).send({
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
    .then((card) => res.status(STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new IncorrectDataError("Bed requiest"));
      } else if (err.message === "Not Found") {
        next(new NotFoundError("Object not found"));
      } else {
        res.status(ERROR_DEFAULT).send({
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
