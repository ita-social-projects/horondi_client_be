const categoryType = ` 
    _id: ID!
    categoryCode: String!
    name: [Language!]
    images: ImageSet
    subcategories: [Subcategory!]
    available: Boolean!
`;
module.exports = categoryType;
