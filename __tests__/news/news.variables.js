const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');

const user = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

const news = {
  title: [
    { lang: 'uk', value: 'bbb' },
    { lang: 'eng', value: 'bbb' },
  ],
  text: [
    { lang: 'uk', value: ' d a s d' },
    { lang: 'eng', value: ' a s d' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'a sd' },
      { lang: 'eng', value: 'a sd' },
    ],
  },
  images: {
    primary: { medium: 'ada s.jpg' },
    additional: [],
  },
  date: '1111118820047',
};

const newsUpdateData = {
  title: [
    { lang: 'uk', value: 'bbb' },
    { lang: 'eng', value: 'bbb' },
  ],
  text: [
    { lang: 'uk', value: 'u p d a t e N1 d a s d' },
    { lang: 'eng', value: 'update dN1 a s d' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'updated sd' },
      { lang: 'eng', value: 'updated sd' },
    ],
  },
};

const existingNews = {
  title: [
    {
      lang: 'uk',
      value: 'Аксесуар на пояс, зручна сумка, стильна штучка!',
    },
    {
      lang: 'en',
      value: 'Belt accessory, comfortable bag, stylish thingy!',
    },
  ],
  date: '43432432432434',
};

module.exports = {
  user,
  news,
  newsUpdateData,
  existingNews,
};
