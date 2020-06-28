const jwt = require('jsonwebtoken');

const generateToken = async (userId, name) => {
  const token = await jwt.sign({ userId, name }, process.env.SECRET, {
    expiresIn: '1h',
  });
  return token;
};
module.exports = generateToken;
