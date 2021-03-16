const sidePocketType = `
  type SidePocket {
    _id: ID!
    name: [Language]
    material: Material
    color: Color
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
    HIDDEN
  }
`;

const sidePocketInput = `
  input SidePocketInput {
    _id: ID!
    name: [LanguageInput]!
    material: ID!
    color: ID!
    side: SideOptions
    image: String
    basePrice: Int!
    available: Boolean
    default: Boolean
  }
`;

module.exports = {
  sidePocketType,
  sideOptions,
  sidePocketInput,
};
