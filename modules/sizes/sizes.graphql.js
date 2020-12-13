const sizesType = `
  type Sizes {
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

const sizesInput = `
  input SizesInput {
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
  sizesType,
  sizesInput,
};
