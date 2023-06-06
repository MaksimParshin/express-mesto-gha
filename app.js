const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());


app.use((req, res, next) => {
  req.user = {
    _id: "647df19e5dfd9a1259a22d13",
  };
  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.use('/', (req, res)=> res.status(404).send({message: 'Invalid router'}))
app.listen(PORT, () => {
  console.log("listening on");
});
