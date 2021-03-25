const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    model: Model
    blocker: [Blocker]
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const pocketInput = `
  input PocketInput {
    name: [LanguageInput]
    model: ID
    blocker: [BlockerInput]
    image: Upload
    additionalPrice: Int
    available: Boolean
    default: Boolean
  }
`;

module.exports = {
  pocketType,
  pocketInput,
};
