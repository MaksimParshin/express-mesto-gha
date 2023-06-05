const router = require('express').Router();
const { getUsers, getUserByID, createUser } = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:id", getUserByID);

router.post("/users", createUser);

module.exports = router;