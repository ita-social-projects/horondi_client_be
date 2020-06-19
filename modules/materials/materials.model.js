const materialType = ` 
    _id: ID!
    name: [Language!]
    description: [Language!]
    colors: [Color!] 
    available: Boolean!
    additionalPrice: Float!
`;

const materialInput = `
    name: [LanguageInput!]
    description: [LanguageInput!]
    colors: [ColorInput!] 
    available: Boolean!
    additionalPrice: Float!
`;

module.exports = { materialType, materialInput };
