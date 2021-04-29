const strapType = `
  type Strap {
    _id: ID
    name: [Language]
    optionType: String
    model: Model
    features: StrapFeature
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    default: Boolean
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
    additionalPrice: Int
    available: Boolean
    default: Boolean
  }

  input StrapFeatureInput {
    color: ID
  }
`;

module.exports = {
  strapType,
  strapFeatureType,
  strapInputs,
};
