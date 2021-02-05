let skip = 0;
let limit = 0;
const wrongId = '5fa8f2ad0785350940d8953e';
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
  },
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
  news,
  newsUpdateData,
  existingNews,
  wrongId,
  skip,
  limit,
};
