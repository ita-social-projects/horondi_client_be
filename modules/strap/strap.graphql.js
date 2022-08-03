const strapType = `
  type Strap {
    _id: ID
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: StrapFeatureSet
    images: ImageSet
    absolutePrice: Int
    relativePrice: Int
    available: Boolean
    customizable: Boolean
    translationsKey: ID
  }
`;

const strapFeatureSet = `
  type StrapFeatureSet {
    material: Material
    color: Color
  }
`;

const strapInputs = `
  input StrapInput {
    name: [LanguageInput]
    optionType: String
    model: ID
    features: StrapFeatureSetInput
    image: Upload
    absolutePrice: Int
    relativePrice: Int
    available: Boolean
    customizable: Boolean
  }

  input StrapFeatureSetInput {
    material: ID
    color: ID
  }

  input StrapFilterInput{
    name:String
    available:[String]
    material:[String]
    color:[String]
  }
`;

module.exports = {
  strapType,
  strapFeatureSet,
  strapInputs,
};
