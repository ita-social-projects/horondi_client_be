const closureType = `
  type Closure {
    _id: ID
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: ClosureFeatureSet
    images: ImageSet
    absolutePrice: Int
    available: Boolean
    customizable: Boolean
    translations_key: ID!
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
    images: ImageSetInput
    absolutePrice: Int!
    available: Boolean
    customizable: Boolean
  }

  input ClosureFeatureSetInput {
    material: ID
    color: ID
  }
  
    input ClosureFilterInput{
    search: String
    name:String
    model:[String]
    available:[String]
  }
`;

module.exports = {
  closureInputs,
  closureType,
  closureFeatureSet,
};
