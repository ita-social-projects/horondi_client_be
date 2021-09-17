const constructorBottomType = `
  type ConstructorBottom {
    _id: ID!
    name: [Language]!
    optionType: OptionTypeEnum
    model: Model
    features: ConstructorBottomFeatureSet
    image: String
    basePrice: [CurrencySet]
    available: Boolean!
    customizable: Boolean
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
    basePrice: Float
    available: Boolean
    customizable: Boolean
  }

  input ConstructorBottomFeatureInput {
    material: ID
    color: ID
  }

  input ConstructorBottomFilterInput {
    name:String
    model:[String]
    color:[String]
    material:[String]
    available:[String]
  }
`;

module.exports = {
  constructorBottomInputs,
  constructorBottomType,
  constructorBottomFeatureSet,
};
