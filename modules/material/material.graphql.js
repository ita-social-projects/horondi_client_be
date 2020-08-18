const materialType = `
    type Material {
    _id: ID!
    name: [Language]
    description: [Language]
    purpose: String
    colors: [Color]
    available: Boolean
    additionalPrice: Float
    }
`;

const materialInput = `
    input MaterialInput {
    name: [LanguageInput]
    description: [LanguageInput]
    purpose: String
    colors: [ColorInput]
    available: Boolean
    additionalPrice: Float
    }
`;

module.exports = { materialType, materialInput };
