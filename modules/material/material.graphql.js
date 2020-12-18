const materialType = `
    type Material {
    _id: ID!
    name: [Language]
    description: [Language]
    purpose: String
    color: ID
    available: Boolean
    additionalPrice: [CurrencySet]
    }
`;

const materialInput = `
    input MaterialInput {
    name: [LanguageInput]
    description: [LanguageInput]
    purpose: String
    color: ID
    available: Boolean
    additionalPrice: Int
    }
`;

module.exports = { materialType, materialInput };
