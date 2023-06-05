const router = require('express').Router();
const { getCards, getCardByID, createCard } = require("../controllers/cards");

router.get("/cards", getCards);

router.get("/cards/:id", getCardByID);

router.post("/cards", createCard);

module.exports = router;