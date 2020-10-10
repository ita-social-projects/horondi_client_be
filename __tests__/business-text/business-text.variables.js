const newBusinessText = {
  title: [
    {
      value: 'НоваБТ',
      lang: 'uk',
    },
    {
      value: 'NewBT',
      lang: 'en',
    },
  ],
  code: 'new-code',
  text: [
    {
      value: 'Тут бізнес текст',
      lang: 'uk',
    },
    {
      value: 'Business text here',
      lang: 'en',
    },
  ],
};

const updatedBusinessText = {
  title: [
    {
      value: 'ОновленаБТ',
      lang: 'uk',
      __typename: 'Language',
    },
    {
      value: 'UpdatedBT',
      lang: 'en',
      __typename: 'Language',
    },
  ],
  code: 'updated-code',
  text: [
    {
      value: 'Оновлений бізнес текст',
      lang: 'uk',
      __typename: 'Language',
    },
    {
      value: 'Updated business text',
      lang: 'en',
      __typename: 'Language',
    },
  ],
};

const notExistBusinessTextId = '5f311ec5f2983e390432a8c3';

module.exports = {
  newBusinessText,
  updatedBusinessText,
  notExistBusinessTextId,
};
