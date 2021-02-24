const sizeType = `
  type Size {
    _id: ID!
    name: String!
    simpleName:[Language]!
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: [CurrencySet]!
  }
`;

const sizeInput = `
  input SizeInput {
    name: String!
    simpleName: [LanguageInput]!
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: Int!
  }
`;

module.exports = {
  sizeType,
  sizeInput,
};
