const categoryType = `
    type Category {
    _id: ID!
    code: String!
    name: [Language]
    images: ImageSet
    available: Boolean
}
`;

const categoryInput = `
    input CategoryInput {
    code: String
    name: [LanguageInput]
    images: ImageSetInput
    available: Boolean
    }`;

module.exports = { categoryType, categoryInput };
