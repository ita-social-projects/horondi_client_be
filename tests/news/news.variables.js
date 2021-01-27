const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} = require('../../dotenvValidator');

const user = {
  email: SUPER_ADMIN_EMAIL,
  password: SUPER_ADMIN_PASSWORD,
};

const wrongId = '5fa8f2ad0785350940d8953e';
const upload = ['__tests__/model/img.png', '__tests__/model/img2.png'];

const news = {
  title: [
    { lang: 'ua', value: 'bbb' },
    { lang: 'en', value: 'bbb' },
  ],
  text: [
    { lang: 'ua', value: 'd a s d' },
    { lang: 'en', value: 'a s d' },
  ],
  author: {
    name: [
      { lang: 'ua', value: 'a sd' },
      { lang: 'en', value: 'a sd' },
    ],
    image: 'large_test-file',
  },
  image: 'large_test-file',
  date: '1111118820047',
  show: true,
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
  upload,
  user,
  news,
  newsUpdateData,
  existingNews,
  wrongId,
};
