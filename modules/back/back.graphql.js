const backType = `
  type Back {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: BackFeatureSet
    images: ImageSet
    additionalPrice: [AdditionalCurrencySet]
    available: Boolean
    customizable: Boolean
    translationsKey: ID
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
    additionalPrice: additionalPriceInput!
    available: Boolean
    customizable: Boolean
  }

  input BackFeatureSetInput {
    material: ID
    color: ID
  }

  input BackFilterInput{
    name:String
    model:[String]
    available:[String]
    material:[String]
    color:[String]
  }
`;

module.exports = {
  backType,
  backInputs,
  backFeatureSet,
};
