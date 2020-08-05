const categoryType = `
    type Category {
    _id: ID!
    categoryCode: String
    name: [Language]
    images: ImageSet
    subcategories: [ID]
    isMain: Boolean
    available: Boolean
}
`;

const categoryInput = `
    input CategoryInput {
    categoryCode: String
    name: [LanguageInput]
    images: ImageSetInput
    subcategories: [ID]
    isMain: Boolean
    available: Boolean
    }`;

module.exports = { categoryType, categoryInput };
