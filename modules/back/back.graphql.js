const backType = `
  type Back {
    _id: ID!
    name: [Language]
    optionType: String
    model: Model
    features: BackFeatureSet
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const backFeatureSet = `
  type BackFeatureSet {
    material: Material
    color: Color
  }
`;

const backInputs = `
  input BackInput {
    name: [LanguageInput]
    optionType: String
    model: ID
    features: BackFeatureSetInput
    image: Upload
    additionalPrice: Int
    available: Boolean
    default: Boolean
  }

  input BackFeatureSetInput {
    material: ID
    color: ID
  }
`;

module.exports = {
  backType,
  backInputs,
  backFeatureSet,
};
