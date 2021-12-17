function createTranslations(data) {
  return Object.keys(data).reduce(
    (translations, key) => {
      if (
        Array.isArray(data[key])
        && Object.prototype.hasOwnProperty.call(data[key][0], 'lang')
      ) {
        translations.ua = Object.assign(translations.ua, {
          [key]: data[key][0].value,
        });
        translations.en = Object.assign(translations.en, {
          [key]: data[key][1].value,
        });
      }
      return translations;
    },
    { ua: {}, en: {} },
  );
}

module.exports = createTranslations;
