const {ApolloError} = require('apollo-server');

class RuleError extends ApolloError {
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        
        Object.defineProperty(this,'name',{value: "RuleError"})
    }
}

module.exports = RuleError;