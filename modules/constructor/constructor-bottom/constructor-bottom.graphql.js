const constructorBottomType = `
  type ConstructorBottom {
    _id: ID!
    name: [Language]!
    material: Material
    color:Color
    image: String
    basePrice: [CurrencySet]
    available: Boolean!
    default:Boolean,
  }
`;

const constructorBottomInput = `
  input ConstructorBottomInput {
    name: [LanguageInput]!
    material: ID!
    color:ID!
    image: String
    basePrice: Int!
    available: Boolean!
    default:Boolean,
  }
`;

module.exports = {
  constructorBottomInput,
  constructorBottomType,
};
