const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ email: decoded.name });
    req.tempUser = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  const { role } = req.tempUser;
  if (!roles.includes(role)) {
    return res
      .status(403)
      .send({
        msg: `Role ${req.user.role} is not authorized to access this route`,
      });
  }
  next();
};
