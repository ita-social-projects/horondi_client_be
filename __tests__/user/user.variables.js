const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');

const adminUser = {
  email: 'admin2123@gmail.com',
  password: 'qwertY123',
};

const superAdminUser = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

const newAdmin = {
  email: 'admintest4@gmail.com',
  firstName: 'Hook',
  lastName: 'Age',
  pass: 'dffdsfsdsdf',
};

const newUser = {
  firstName: 'Pepo',
  lastName: 'Markelo',
  email: '1xamp31d2v1@gmail.com',
  password: 'qwertY123',
  language: 1,
};

const testUser = {
  firstName: 'Petro',
  lastName: 'Tatsenyak',
  email: 'qwerdsd223@gmail.com',
  pass: '12345678Pt',
  phoneNumber: '380666666666',
  role: 'admin',
  language: 1,
  address: {
    country: 'Ukraine',
    city: 'Kiev',
    street: 'Shevchenka',
    buildingNumber: '23',
  },
  wishlist: [],
  orders: [],
  comments: [],
};

module.exports = {
  adminUser,
  newAdmin,
  superAdminUser,
  testUser,
  newUser,
};
