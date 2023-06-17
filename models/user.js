const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default:"Жак-Ив Кусто",
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: { type: String, default:"Исследователь океана", required: true, minlength: 2, maxlength: 30 },
  avatar: { type: String, default:"https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png", required: [true, "Поле avatar должно быть заполнено"]},
  email: { type: String, unique: true, required: [true, "Поле email должно быть заполнено"]},
  password: { type: String, select: false, required: [true, "Поле password должно быть заполнено"]},
});


userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
}

module.exports = mongoose.model("user", userSchema);
