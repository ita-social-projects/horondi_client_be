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
    type MaterialByPurpose {
      main: [Material]
      inner: [Material]
      bottom: [Material]
      pattern: [Material]
      closure: [Material]
    }

    enum PurposeEnum{
      MAIN
      INNER
      BOTTOM
      PATTERN
      CLOSURE
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
