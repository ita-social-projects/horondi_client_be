const translationsType = `
  type Translations {
    _id: ID
    ua: UaTranslations
    en: EnTranslations
  }
  type UaTranslations {
    name: String
    title: String
    description: String
  }
  type EnTranslations {
    name: String
    title: String
    description: String
  }
`;

module.exports = {
  translationsType,
};
