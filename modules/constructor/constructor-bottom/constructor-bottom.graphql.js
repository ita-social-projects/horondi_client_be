const constructorBottomType = `
  type ConstructorBottom {
    _id: ID!
    name: [Language]!
    material: Material
    image: String
    basePrice: [CurrencySet]
    available: Boolean!
  }
`;

const constructorBottomInput = `
  input ConstructorBottomInput {
    name: [LanguageInput]!
    material: ID!
    image: String
    basePrice: Int!
    available: Boolean!
  }
`;

module.exports = {
  constructorBottomInput,
  constructorBottomType,
};
