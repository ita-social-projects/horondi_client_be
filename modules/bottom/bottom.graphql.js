const bottomType = `
  type Bottom {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    features: BottomFeatureSet
    images: ImageSet
    absolutePrice: Int
    available: Boolean
    translationsKey: ID
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
    absolutePrice: Int!
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
