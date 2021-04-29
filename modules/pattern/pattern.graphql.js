const patternType = `
    type Pattern {
      _id: ID!
      name: [Language]
      optionType: String
      model: Model
      features: PatternFeatureSet
      description: [Language]
      images: ImageSet
      constructorImg: String
      additionalPrice: [CurrencySet]
      available: Boolean
      customizable: Boolean
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
      additionalPrice: Int
      available: Boolean
      customizable: Boolean
    }

    input PatternFeatureSetInput {
      material: ID
      handmade: Boolean
    }
`;

module.exports = {
  patternType,
  patternInputs,
  patternFeatureSet,
};
