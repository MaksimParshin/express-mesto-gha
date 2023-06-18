const router = require('express').Router();
const { getUsers, getUserByID, createUser, updateProfile, updateAvatar, currentUser } = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/me", currentUser);

router.post("/users", createUser);

router.get("/users/:userId", getUserByID);

router.patch("/users/me", updateProfile);

router.patch("/users/me/avatar", updateAvatar);

module.exports = router;