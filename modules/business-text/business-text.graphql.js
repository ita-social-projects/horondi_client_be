const businessTextType = `
    type BusinessText {
    _id: ID!
    code: String!
    sectionsImgs: [BusinessTextImg]
    languages: [String]
    footerImg: BusinessTextImg
    date: String,
    translationsKey: ID!
}
`;

const businessTextWithPopulatedTranslationsKeyType = `
    type BusinessTextWithPopulatedTranslationsKey {
    _id: ID!
    code: String!
    sectionsImgs: [BusinessTextImg]
    languages: [String]
    footerImg: BusinessTextImg
    date: String,
    translations: BusinessPageTranslationsKey
}
`;

const businessTextTranslationFieldsInput = `
    input BusinessTextTranslationFieldsInput {
    ua: BusinessPageTranslationsKeyLanguageInput
    en: BusinessPageTranslationsKeyLanguageInput
    }
`;

const businessTextInput = `
    input BusinessTextInput {
    code: String!
    sectionsImgs: [BusinessTextImgInput]
    languages: [String]
    footerImg: BusinessTextImgInput
    }
`;

module.exports = {
  businessTextType,
  businessTextWithPopulatedTranslationsKeyType,
  businessTextTranslationFieldsInput,
  businessTextInput,
};
