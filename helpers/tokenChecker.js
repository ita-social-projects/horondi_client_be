const { verify } = require('jsonwebtoken');

const RuleError = require('../errors/rule.error');
const { TOKEN_IS_EXPIRIED } = require('../error-messages/user.messages');
const {
  STATUS_CODES: { UNAUTHORIZED },
} = require('../consts/status-codes');

const tokenChecker = async (token, secret) => {
  try {
    return await verify(token, secret);
  } catch (e) {
    throw new RuleError(TOKEN_IS_EXPIRIED, UNAUTHORIZED);
  }
};

module.exports = { tokenChecker };
