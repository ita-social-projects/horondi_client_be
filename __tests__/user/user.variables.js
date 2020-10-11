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

const testUser = {
  firstName: 'Petro',
  lastName: 'Tatsenyak',
  email: 'f5dbbdnvf@gmail.com',
  password: '12345678Pt',
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
};
