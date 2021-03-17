const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    side: SideOptions
    image: String
    basePrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const sideOptions = `
  enum SideOptions {
    LEFT
    RIGHT
    FRONT
    BACK
  }
`;

const pocketInput = `
  input PocketInput {
    name: [LanguageInput]
    side: SideOptions
    image: Upload
    basePrice: Int
    available: Boolean
    default: Boolean
  }
`;

module.exports = {
  pocketType,
  sideOptions,
  pocketInput,
};
