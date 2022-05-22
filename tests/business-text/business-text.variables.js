const newBusinessText = {
  code: 'whatver',
  languages: ['ua', 'en'],
};
const businessTextTranslationFields = {
  ua: {
    title: 'Рюкзаки як терапія',
    text: 'авівіфаавіа',
  },
  en: {
    title: 'Backpacks as therapy',
    text: 'asfasdf',
  },
};
const updatedBusinessText = {
  code: 'whatver',
  languages: ['ua', 'en'],
};
const updatedBusinessTextTranslationFields = {
  ua: {
    title: 'оновлено',
    text: 'оновлений текст',
  },
  en: {
    title: 'Updated',
    text: 'оновлений текст',
  },
};
const notExistBusinessTextId = '5f311ec5f2983e390432a8c3';
const code = 'whatver';
const wrongCode = 'not-existing-code';

module.exports = {
  newBusinessText,
  updatedBusinessText,
  notExistBusinessTextId,
  businessTextTranslationFields,
  updatedBusinessTextTranslationFields,
  code,
  wrongCode,
};
