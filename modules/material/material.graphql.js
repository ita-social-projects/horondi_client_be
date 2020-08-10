const materialType = `
    type Material {
    _id: ID!
    name: [Language]
    description: [Language]
    colors: [Color]
    available: Boolean
    additionalPrice: [CurrencySet]
    }
`;

const materialInput = `
    input MaterialInput {
    name: [LanguageInput]
    description: [LanguageInput]
    colors: [ColorInput]
    available: Boolean
    additionalPrice: [CurrencySetInput]
    }
`;

module.exports = { materialType, materialInput };
