const backType = `
  type Back {
    name: [Language]
    model: Model
    material: Material
    color: Color
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const backInput = `
  input BackInput {
    name: [LanguageInput]
    model: ID
    material: ID
    color: ID
    image: Upload
    additionalPrice: Int
    available: Boolean
    default: Boolean
  }
`;

module.exports = {
  backType,
  backInput,
};
