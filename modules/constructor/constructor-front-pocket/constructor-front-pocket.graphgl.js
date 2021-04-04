const constructorFrontPocketType = `  
type ConstructorFrontPocket {
    _id: ID!
    name: [Language]
    optionType: String
    model: Model
    features: ConstructorFrPocketFeatureSet
    image:String
    basePrice: [CurrencySet]
    available: Boolean
    default:Boolean
  }
`;

const constructorFrPocketFeatureSet = `
  type ConstructorFrPocketFeatureSet {
    material:Material
    color:Color
    pattern: Pattern
  }
`;

const constructorFrontPocketInputs = `  
input ConstructorFrontPocketInput {
  name: [LanguageInput]
  optionType: String
  model: ID
  features: ConstructorFrPocketFeatureInput
  image: String
  basePrice: [CurrencySetInput]
  available: Boolean
  default:Boolean
}

input ConstructorFrPocketFeatureInput {
  material: ID
  color: ID
  pattern: ID
}
`;

module.exports = {
  constructorFrontPocketType,
  constructorFrontPocketInputs,
  constructorFrPocketFeatureSet,
};
