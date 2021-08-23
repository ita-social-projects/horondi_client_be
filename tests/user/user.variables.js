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

const filter = {
  days: 1,
};

const googleToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlZjRiZDkwODU5' +
  'MWY2OTdhOGE5Yjg5M2IwM2U2YTc3ZWIwNGU1MWYiLCJ0eXAiOiJKV1QifQ.eyJpc' +
  '3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAyMTE4NTcxMjE0MC1mZ' +
  'nVpbHBobjVhbWg5NzlpN2ljb20zNXJqcGk3bm1pdC5hcHBzLmdvb2dsZXVzZXJjb' +
  '250ZW50LmNvbSIsImF1ZCI6IjEwMjExODU3MTIxNDAtZmZ1aWxwaG41YW1oOTc5a' +
  'TdpY29tMzVyanBpN25taXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzd' +
  'WIiOiIxMDY0NjM2NTIxNzU3MTg0ODc3NzkiLCJlbWFpbCI6ImhsbGF2dXJkYFIwM' +
  'DFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJrQ' +
  'mNKd1pxM2d0ODRrZWlnekJJY3dnIiwibmFtZSI6IlRhdnRffmFjfWFuIiwicGljd' +
  'HVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxN' +
  'EdoVjdybWcyVzdqZ1hJUkFlV3R1YmtRRWZheHp4c0R1WmlhUkFSTklnPXM5Ni1jI' +
  'iwiZ2l2ZW5fbmFtZSI6IlRFcFFpcmFzeWFFIiwibG9jYWxlIjoidWsiLCJpYXQiO' +
  'jE2Mjk3MTI3NjEsImV4cCI6MTYyOTcxNjM2MSwianRpIjoiNjEwZWMxMDRkNGViM' +
  'mM5M2IyZGQ3ZDdmMGYwMmE4N2YyNzhiMWYyNCJ9.hzfI7bkm_p_Emi0UgTLxQc8N' +
  'ea9eWhcq0AbAeNX2EaqhTpostp0c0sHtVoXbUIhq-6LPg6hfB-iteae8SjqxF0OG' +
  '_fONv1D3zqcesgXj_3TSH7MpKQKaU7qtpdz2NFaNOyGs979ZzrpUjrYy8Fh9d3Fd' +
  'hvY8NCsXMNuMPTo_1EoAWaXzJZoW4lKcSwfg04d-j70wfsx0q0kMFGQFgHlhA8Fw' +
  'suy2YfoBmNR5F0FGyGYfJz2mUJ9IjfXo7laSf6NvEo8g2Vu3G_0CAD_D7Ps1d8H8' +
  '3OfMkYsmLGv1mTJqRO6_D7zEsFO7nuQ3p7xeFxuYhCvePADth6Mbr9e-rioe4A';

const INVALID_FIRST_NAME =
  '"firstName" with value "H" fails to match the required pattern: ';
const INVALID_LAST_NAME =
  '"lastName" with value "O" fails to match the required pattern: ';
const INVALID_PASSWORD =
  '"password" with value "You" fails to match the required pattern: /^(?=.*[a-zA-Zа-яА-Яіїє])^(?=.*[A-ZА-ЯІЇЄ])(?=.*\\d)[a-zA-Zа-яА-ЯіїєІЇЄ\\d]{6,30}$/';
const INVALID_ROLE = '"role" must be one of [admin, superadmin]';

module.exports = {
  newAdmin,
  superAdminUser,
  testUser,
  testUsersSet,
  googleToken,
  user,
  wrongId,
  filter,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME,
  INVALID_PASSWORD,
  INVALID_ROLE,
};
