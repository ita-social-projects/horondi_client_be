const { ApolloError } = require('apollo-server');

class RuleError extends ApolloError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'RuleError';
  }
}

module.exports = RuleError;
