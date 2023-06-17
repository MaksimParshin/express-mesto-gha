class UserNotFound extends Error {
  constructor(err) {
    super(err);
    this.message = err.body;
    this.statusCode = 404;
  }
}


class Abstract extends Error {
  constructor(err) {
    super(err);
    this.message = 'Пользователь не найден';
    this.statusCode = err.statusCode;
  }
}

const errorHendler = (err, req, res, next) => {
  let error;
if (err.statusCode === 404) {
error = new UserNotFound(err)
} else {
  error = new Abstract(err)
}

  res.status(err.statusCode).send({ message: error.message });
  next();
};



module.exports = errorHendler;
