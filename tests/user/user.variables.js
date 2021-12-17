const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');

const wrongEmail = 'udernotfound@gmail.com';
const wrongPassword = '12345678pT';
const wrongId = '23ee481430a0056b8e5cc015';

const invalidFirstName = 'H';
const invalidLastName = 'O';
const invalidPassword = 'You';
const invalidToken = `ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2
    VySWQiOiI1ZjU0ZDY1NDE0NWJiNzM3NzQxYmNmMDMiLCJlbWFpbCI6InN1c
    GVyYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNTk5Mzk1NDEyfQ.
    5z1BRqzxF41xmgKr3nDEDBjrv8TxrkOubAEZ3hEOZcw`;

const superAdminUser = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

const newAdmin = {
  email: 'admintest4@gmail.com',
  firstName: 'Hook',
  lastName: 'Age',
  pass: 'dffds45TYfsdsdf',
};

const testUsersSet = [
  {
    firstName: 'Albina',
    lastName: 'Todoriyk',
    email: 'albinaT@gmail.com',
    pass: 'qwertY123',
    language: 1,
    banned: {
      blockPeriod: '30',
      blockCount: 1,
    },
  },
  {
    firstName: 'Denis',
    lastName: 'Babarin',
    email: 'denisBB@gmail.com',
    pass: 'qwertY124',
    language: 1,
    banned: {
      blockPeriod: '0',
      blockCount: 1,
    },
  },
  {
    firstName: 'Zelda',
    lastName: 'Evense',
    email: 'zeldaB@gmail.com',
    pass: 'qwertY125',
    language: 1,
    banned: {
      blockPeriod: '0',
      blockCount: 1,
    },
  },
  {
    firstName: 'Pepo',
    lastName: 'Markelo',
    email: 'example@gmail.com',
    pass: 'qwertY123',
    language: 1,
    banned: {
      blockPeriod: '30',
      blockCount: 1,
    },
  },
  {
    firstName: 'Petro',
    lastName: 'Tatsenyak',
    email: 'f5dbbdnvf1@gmail.com',
    pass: '12345678Pt',
    language: 1,
    banned: {
      blockPeriod: '30',
      blockCount: 1,
    },
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
  orders: [],
  comments: [],
};

const user = {
  firstName: 'Pepo',
  lastName: 'Markelo',
  email: '1xamp31d2v1@gmail.com',
  pass: 'qwertY123',
  language: 1,
};

const newUser = {
  firstName: 'One',
  lastName: 'User',
  email: 'secretEmail@sec.com',
  password: 'qwerTY12345',
};

const filter = {
  days: 1,
};

const socialToken = 'asd.dsa.cds';

const INVALID_FIRST_NAME = '"firstName" with value "H" fails to match the required pattern: ';
const INVALID_LAST_NAME = '"lastName" with value "O" fails to match the required pattern: ';
const INVALID_PASSWORD = '"password" with value "You" fails to match the required pattern: /^(?=.*[A-ZА-ЯІЇЄ])(?=.*\\d)[a-zA-Zа-яА-ЯіїєІЇЄ\\d!@#$%^&*()~¥=_+}{":;\'?/>.<,\\\\`|[\\]-]{6,30}$/';
const INVALID_ROLE = '"role" must be one of [admin, superadmin]';

module.exports = {
  newAdmin,
  superAdminUser,
  testUser,
  testUsersSet,
  socialToken,
  user,
  newUser,
  wrongId,
  wrongPassword,
  wrongEmail,
  filter,
  invalidFirstName,
  invalidLastName,
  invalidPassword,
  invalidToken,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME,
  INVALID_PASSWORD,
  INVALID_ROLE,
};
