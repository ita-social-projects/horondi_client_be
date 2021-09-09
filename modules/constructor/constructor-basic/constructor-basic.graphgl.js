const constructorBasicType = `  
type ConstructorBasic {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: ConstructorBasicFeatureSet
    image:String
    basePrice: [CurrencySet]
    available: Boolean
    customizable: Boolean
  }
`;

const constructorBasicFeatureSet = `
  type ConstructorBasicFeatureSet {
    material: Material
    color: Color
  }
`;

const constructorBasicInputs = `  
input ConstructorBasicInput {
    name: [LanguageInput]
    optionType: String
    model: ID
    features: ConstructorBasicFeatureInput
    image: String
    basePrice: Float
    available: Boolean
    customizable: Boolean
  }

input ConstructorBasicFeatureInput {
  material: ID
  color:ID
}

input ConstructorBasicFilterInput {
  name:String
  model:[String]
  material:[String]
  color:[String]
  available:[String]
}
`;

module.exports = {
  constructorBasicType,
  constructorBasicInputs,
  constructorBasicFeatureSet,
};
