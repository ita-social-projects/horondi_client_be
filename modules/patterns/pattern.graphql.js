const patternsType = ` 
    _id: ID!
    name: [Language!]
    description: [Language!]
    images: ImageSet
    material: String!
    handmade: Boolean!
    available: Boolean!
`;

const patternsInput = ` 
    name: [LanguageInput!]
    description: [LanguageInput!]
    images: ImageSetInput
    material: String!
    handmade: Boolean!
    available: Boolean!
`;

module.exports = { patternsType, patternsInput };
