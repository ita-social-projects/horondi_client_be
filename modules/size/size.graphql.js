const sizeType = `
  type Size {
    _id: ID!
    name: String!
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
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: [CurrencySetInput]!
  }
`;

module.exports = {
  sizeType,
  sizeInput,
};
