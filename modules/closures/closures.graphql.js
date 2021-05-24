const closureType = `
  type Closure {
    _id: ID
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: ClosureFeatureSet
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    customizable: Boolean
  }
`;

const closureFeatureSet = `
  type ClosureFeatureSet {
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
    additionalPrice: Int
    available: Boolean
    customizable: Boolean
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
