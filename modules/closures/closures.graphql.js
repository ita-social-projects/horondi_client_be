const closureType = `
  type Closure {
    _id: ID
    name: [Language]
    material: Material
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
  }
`;
const closureInput = `
  input ClosureInput {
    name: [LanguageInput]
    material: ID
    image: Upload
    additionalPrice: [CurrencySetInput]
    available: Boolean
  }
`;
module.exports = {
  closureInput,
  closureType,
};
