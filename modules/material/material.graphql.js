const materialType = `
    type Material {
    _id: ID!
    name: [Language]
    description: [Language]
    purpose: String
    colors: [Color]
    available: Boolean
    additionalPrice: [CurrencySet]
    }
`;

const materialInput = `
    input MaterialInput {
    name: [LanguageInput]
    description: [LanguageInput]
    purpose: String
    colors: [ColorInput]
    available: Boolean
    additionalPrice: Int
    }
`;

module.exports = { materialType, materialInput };
