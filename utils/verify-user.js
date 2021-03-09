const jwt = require('jsonwebtoken');
const { SECRET } = require('../dotenvValidator');

const RuleError = require('../errors/rule.error');

const verifyUser = token => {
  if (!token) return;

  try {
    const decodedToken = jwt.verify(token, SECRET);
    if (!decodedToken) {
      throw new RuleError('TOKEN_IS_NOT_VALID', 401);
    }
    return decodedToken;
  } catch (e) {
    return new RuleError(e.message, e.statusCode);
  }
};
module.exports = verifyUser;
