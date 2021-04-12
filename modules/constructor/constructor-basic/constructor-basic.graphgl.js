const constructorBasicType = `  
type ConstructorBasic {
    _id: ID!
    name: [Language]
    optionType: String
    model: Model
    features: ConstructorBasicFeatureSet
    image:String
    basePrice: [CurrencySet]
    available: Boolean
    default:Boolean
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
    basePrice: Int
    available: Boolean
    default:Boolean
  }

input ConstructorBasicFeatureInput {
  material: ID
  color:ID
}
`;

module.exports = {
  constructorBasicType,
  constructorBasicInputs,
  constructorBasicFeatureSet,
};
