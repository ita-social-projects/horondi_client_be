const businessTextType = `
    type BusinessText {
    _id: ID!
    code: String
    title: [Language]
    text: [Language]
    date: String
}
`;

const businessTextInput = `
    input BusinessTextInput {
    code: String
    title: [LanguageInput]
    text: [LanguageInput]
    }`;

module.exports = { businessTextType, businessTextInput };
