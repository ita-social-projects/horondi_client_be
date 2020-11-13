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

const testUsersSet = [
  {
    firstName: 'Albina',
    lastName: 'Todoriyk',
    email: 'albinaT@gmail.com',
    password: 'qwertY123',
    language: 1,
    banned: true,
  },
  {
    firstName: 'Denis',
    lastName: 'Babarin',
    email: 'denisBB@gmail.com',
    password: 'qwertY123',
    language: 1,
    banned: false,
  },
  {
    firstName: 'Bob',
    lastName: 'Evense',
    email: 'evenseB@gmail.com',
    password: 'qwertY123',
    language: 1,
    banned: false,
  },
  {
    firstName: 'Pepo',
    lastName: 'Markelo',
    email: 'example@gmail.com',
    password: 'qwertY123',
    language: 1,
    banned: true,
  },
  {
    firstName: 'Petro',
    lastName: 'Tatsenyak',
    email: 'f5dbbdnvf1@gmail.com',
    password: '12345678Pt',
    language: 1,
    banned: true,
  },
];

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
  testUsersSet,
};
