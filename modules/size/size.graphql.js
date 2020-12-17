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

module.exports = {
  sizeType,
};
