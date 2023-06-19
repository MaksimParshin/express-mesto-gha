const { ERROR_INCORRECT_DATA } = require('../utils/constants');

class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INCORRECT_DATA;
    this.name = 'IncorrectData';
  }
}

module.exports = IncorrectDataError;