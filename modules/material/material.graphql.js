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
      colors: [ID!]
      available: Boolean
      additionalPrice: Int
    }
`;

const materialFilterInput = `
  input MaterialFilterInput {
    colors: [String!]
  }
`;

module.exports = {
  materialType,
  materialInput,
  materialFilterInput,
};
