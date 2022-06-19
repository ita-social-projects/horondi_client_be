const strapType = `
  type Strap {
    _id: ID
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: StrapFeature
    images: ImageSet
    absolutePrice: Int
    relativePrice: Int
    available: Boolean
    customizable: Boolean
    translationsKey: ID
  }
`;

const strapFeatureType = `
  type StrapFeature {
    color: Color
  }
`;

const strapInputs = `
  input StrapInput {
    name: [LanguageInput]
    optionType: String
    model: ID
    features: StrapFeatureInput
    image: Upload
    absolutePrice: Int
    relativePrice: Int
    available: Boolean
    customizable: Boolean
  }

  input StrapFeatureInput {
    color: ID
  }

  input StrapFilterInput{
    name:String
    available:[String]
    color:[String]
  }
`;

module.exports = {
  strapType,
  strapFeatureType,
  strapInputs,
};
