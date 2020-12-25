const closureType = `
  type Closure {
    _id: ID!
    name: [Language]!
    material: Material
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean!
  }
`;
const closureInput = `
  input Closure {
    name: [LanguageInput]!
    material: ID!
    image: String
    additionalPrice: Int!
    available: Boolean!
  }
`;
module.exports = {
  closureInput,
  closureType,
};
