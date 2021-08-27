const skip = 0;
const limit = 0;
const wrongId = '5fa8f2ad0785350940d8953e';
const news = {
  title: [
    { lang: 'ua', value: 'bbbbbb' },
    { lang: 'en', value: 'bbbbbb' },
  ],
  text: [
    { lang: 'ua', value: 'd a s d' },
    { lang: 'en', value: 'a s d ccccc' },
  ],
  author: {
    name: [
      { lang: 'ua', value: 'a sddsd' },
      { lang: 'en', value: 'a sdsds' },
    ],
  },
  date: '1111118820047',
  show: true,
};
const newsUpdateData = {
  title: [
    { lang: 'uk', value: 'bbbccc' },
    { lang: 'en', value: 'bbbccc' },
  ],
  text: [
    { lang: 'uk', value: 'u p d a t e N1 d a s d' },
    { lang: 'en', value: 'update dN1 a s d' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'updated sd' },
      { lang: 'en', value: 'updated sd' },
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
