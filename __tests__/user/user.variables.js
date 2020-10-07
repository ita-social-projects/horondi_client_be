require('dotenv').config();

const adminUser = {
  email: 'admin@gmail.com',
  password: 'qwertY123',
};

const superAdminUser = {
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD,
};

const newAdmin = {
  email: 'admintest@gmail.com',
  firstName: 'Hook',
  lastName: 'Age',
  password: 'dffdsfsdsdf',
};

module.exports = {
  adminUser,
  newAdmin,
  superAdminUser,
};
