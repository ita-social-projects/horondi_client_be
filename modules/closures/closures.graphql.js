const closureType = `
  type Closure {
    _id: ID
    name: [Language]
    optionType: String
    model: ID
    features: closureFeatureSet
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const closureFeatureSet = `
  type closureFeatureSet {
    material: Material
    color: Color
  }
`;

const closureInputs = `
  input ClosureInput {
    name: [LanguageInput]
    optionType: String
    model: ID
    features: ClosureFeatureSetInput
    image: Upload
    additionalPrice: [CurrencySetInput]
    available: Boolean
    default: Boolean
  }

  input ClosureFeatureSetInput {
    material: ID
    color: ID
  }
`;

module.exports = {
  closureInputs,
  closureType,
  closureFeatureSet,
};
