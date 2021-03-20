const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    product: Product
    blocker: [Blocker]
    image: String
    basePrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const pocketInput = `
  input PocketInput {
    name: [LanguageInput]
    product: ID
    blocker: [BlockerInput]
    image: Upload
    basePrice: Int
    available: Boolean
    default: Boolean
  }
`;

module.exports = {
  pocketType,
  pocketInput,
};
