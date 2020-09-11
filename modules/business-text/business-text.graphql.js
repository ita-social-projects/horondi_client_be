const businessTextType = `
    type BusinessText {
    _id: ID!
    code: String!
    title: [Language]
    text: [Language]
    languages: [String]
    date: String
}
`;

const businessTextInput = `
    input BusinessTextInput {
    code: String!
    title: [LanguageInput]
    text: [LanguageInput]
    languages: [String]
    }`;

module.exports = { businessTextType, businessTextInput };
