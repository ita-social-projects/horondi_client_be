const businessTextType = `
    type BusinessText {
    _id: ID!
    code: String!
    title: [Language]
    sections: [LanguageArr]
    text: [Language]
    languages: [String]
    footerImg: BusinessTextImg
    date: String,
    translationsKey: ID
}
`;

const businessTextInput = `
    input BusinessTextInput {
    code: String!
    title: [LanguageInput]
    sections: [LanguageInputArr]
    text: [LanguageInput]
    languages: [String]
    footerImg: BusinessTextImgInput
    }`;

module.exports = { businessTextType, businessTextInput };
