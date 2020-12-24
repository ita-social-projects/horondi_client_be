const constructorBottomType = `
  type ConstructorBottom {
    _id: ID!
    name: [Language]!
    material: Material
    image: ImageSet!
    basePrice: [CurrencySet]
    available: Boolean!
  }
`;

const constructorBottomInput = `
  input ConstructorBottomInput {
    name: [LanguageInput]!
    material: ID!
    basePrice: Int!
    available: Boolean!
  }
`;

module.exports = {
  constructorBottomInput,
  constructorBottomType,
};
