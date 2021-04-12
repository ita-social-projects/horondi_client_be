const constructorBottomType = `
  type ConstructorBottom {
    _id: ID!
    name: [Language]!
    optionType: String
    model: Model
    features: ConstructorBottomFeatureSet
    image: String
    basePrice: [CurrencySet]
    available: Boolean!
    default:Boolean
  }
`;

const constructorBottomFeatureSet = `
  type ConstructorBottomFeatureSet {
    material: Material
    color:Color
  }
`;

const constructorBottomInputs = `
  input ConstructorBottomInput {
    name: [LanguageInput]
    optionType: String
    model: ID
    features: ConstructorBottomFeatureInput
    image: String
    basePrice: Int
    available: Boolean
    default:Boolean
  }

  input ConstructorBottomFeatureInput {
    material: ID
    color: ID
  }
`;

module.exports = {
  constructorBottomInputs,
  constructorBottomType,
  constructorBottomFeatureSet,
};
