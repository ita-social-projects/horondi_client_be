const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');
const wrongId = '23ee481430a0056b8e5cc015';
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
    banned: true,
  },
  {
    firstName: 'Denis',
    lastName: 'Babarin',
    email: 'denisBB@gmail.com',
    pass: 'qwertY124',
    language: 1,
    banned: false,
  },
  {
    firstName: 'Zelda',
    lastName: 'Evense',
    email: 'zeldaB@gmail.com',
    pass: 'qwertY125',
    language: 1,
    banned: false,
  },
  {
    firstName: 'Pepo',
    lastName: 'Markelo',
    email: 'example@gmail.com',
    pass: 'qwertY123',
    language: 1,
    banned: true,
  },
  {
    firstName: 'Petro',
    lastName: 'Tatsenyak',
    email: 'f5dbbdnvf1@gmail.com',
    pass: '12345678Pt',
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

const user = {
  firstName: 'Pepo',
  lastName: 'Markelo',
  email: '1xamp31d2v1@gmail.com',
  pass: 'qwertY123',
  language: 1,
};

const INVALID_FIRST_NAME =
  '"firstName" with value "H" fails to match the required pattern: /^(?=.{2,30}$)[a-zA-Zа-яА-ЯІЄіїє]+(([\',. -][a-zA-Zа-яА-ЯІЄіїє])?[a-zA-Zа-яА-ЯІЄіїє]*)*$/u';
const INVALID_LAST_NAME =
  '"lastName" with value "O" fails to match the required pattern: /^(?=.{2,30}$)[a-zA-Zа-яА-ЯІЄіїє]+(([\',. -][a-zA-Zа-яА-ЯІЄіїє])?[a-zA-Zа-яА-ЯІЄіїє]*)*$/u';
const INVALID_PASSWORD =
  '"password" with value "You" fails to match the required pattern: /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,30}$/';
const INVALID_ROLE = '"role" must be one of [admin]';
module.exports = {
  newAdmin,
  superAdminUser,
  testUser,
  testUsersSet,
  user,
  wrongId,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME,
  INVALID_PASSWORD,
  INVALID_ROLE,
};
