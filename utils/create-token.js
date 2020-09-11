const jwt = require('jsonwebtoken');

const generateToken = async (userId, email, params) => {
  const options = !params
    ? { expiresIn: process.env.EXPIRES_IN }
    : params.EXPIRES_IN
      ? { expiresIn: params.EXPIRES_IN }
      : {};
  const secret =    params && params.useConfirmationSecret
    ? process.env.CONFIRMATION_SECRET
    : process.env.SECRET;
  const token = await jwt.sign({ userId, email }, secret, options);
  return token;
};
module.exports = generateToken;
