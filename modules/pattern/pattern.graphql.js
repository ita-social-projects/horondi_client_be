const patternType = `
    type Pattern {
      _id: ID!
      name: [Language]
      optionType: OptionTypeEnum
      model: Model
      features: PatternFeatureSet
      description: [Language]
      images: ImageSet
      constructorImg: String
      additionalPrice: AdditionalCurrencySet
      available: Boolean
      customizable: Boolean
      translationsKey: ID
    }
`;

const patternFeatureSet = `
    type PatternFeatureSet {
      material: Material
      handmade: Boolean
    }
`;

const patternInputs = `
    input PatternInput {
      name: [LanguageInput]
      description: [LanguageInput]
      optionType: String
      model: ID
      features: PatternFeatureSetInput
      images:ImageSetInput
      constructorImg: String
      additionalPrice: additionalPriceInput!
      available: Boolean
      customizable: Boolean
    }

    input PatternFeatureSetInput {
      material: ID
      handmade: Boolean
    }

    input PatternFilterInput{
      name:String
      description:String
      model:[String]
      available:[String]
      material:[String]
      handmade:[String]
    }
`;

module.exports = {
  patternType,
  patternInputs,
  patternFeatureSet,
};
