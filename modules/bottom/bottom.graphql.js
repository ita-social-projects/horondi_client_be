const bottomType = `
  type Bottom {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    features: BottomFeatureSet
    images: ImageSet
    additionalPrice: [AdditionalCurrencySet]
    available: Boolean
  }
`;

const bottomFeatureSet = `
  type BottomFeatureSet {
    material: Material
    color: Color
  }
`;

const bottomInputs = `
  input BottomInput {
    name: [LanguageInput]
    optionType: String
    features: BottomFeatureSetInput
    image: Upload
    additionalPrice: additionalPriceInput!
    available: Boolean
  }

  input BottomFeatureSetInput {
    material: ID
    color: ID
  }

  input BottomFilterInput{
    name:String
  }
`;

module.exports = {
  bottomType,
  bottomInputs,
  bottomFeatureSet,
};
