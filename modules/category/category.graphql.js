const categoryType = `  
    type Category { 
    _id: ID!
    categoryCode: String!
    name: [Language!]
    images: ImageSet
    subcategories: [Subcategory]
    available: Boolean!
}
`;

const categoryInput = `
    input CategoryInput {
    categoryCode: String!
    name: [LanguageInput!]
    images: ImageSetInput
    subcategories: [SubcategoryInput]
    available: Boolean!
    }`;

module.exports = { categoryType, categoryInput };
