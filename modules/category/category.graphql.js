const categoryType = `
    type Category {
    _id: ID!
    code: String
    name: [Language]
    images: ImageSet
    subcategories: [ID]
    isMain: Boolean
    available: Boolean
}
`;

const categoryInput = `
    input CategoryInput {
    code: String
    name: [LanguageInput]
    images: ImageSetInput
    subcategories: [ID]
    isMain: Boolean
    available: Boolean
    }`;

module.exports = { categoryType, categoryInput };
