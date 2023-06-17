const router = require("express").Router();
const userRoutes = require("./users");
const cardRoutes = require("./cards");
const auth = require("../middlewares/auth");

const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use(auth);

router.use(userRoutes);

router.use(cardRoutes);

router.use("/", (req, res) =>
  res.status(404).send({ message: "Invalid router" })
);

module.exports = router;
