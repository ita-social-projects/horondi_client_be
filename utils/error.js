class CustomError {
  constructor(code, message) {
    this.statusCode = code;
    this.message = message;
  }
}
module.exports = CustomError;
