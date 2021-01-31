const materialType = `
    type Material {
      _id: ID!
      name: [Language]
      description: [Language]
      purpose: PurposeEnum
      colors: [Color]
      available: Boolean
      additionalPrice: [CurrencySet]
    }
    enum PurposeEnum{
      MAIN
      INNER
      BOTTOM
      PATTERN
    }
`;

const materialInput = `
    input MaterialInput {
      name: [LanguageInput]
      description: [LanguageInput]
      purpose: PurposeEnum!
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
