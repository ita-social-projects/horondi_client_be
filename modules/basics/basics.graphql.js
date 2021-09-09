const basicsType = `
    type Basics {
        _id: ID!
        name: [Language]
        images: ImageSet
        available: Boolean
        features: basicsFeatureSet
        additionalPrice: [AdditionalCurrencySet]
    }
`;

const basicsFeatureSet = `
    type basicsFeatureSet {
        material: Material
        color: Color 
    }
`;

const basicsInputs = `
    input BasicsInput {
        name: [LanguageInput]
        features: BasicsFeatureSetInput
        image: Upload
        additionalPrice: additionalPriceInput!
        available: Boolean
    }

    input BasicsFeatureSetInput {
        material: ID
        color: ID
    }

    input BasicsFilterInput{
        name:String
        available:[String]
        material:[String]
        color:[String]
    }
`;

module.exports = {
  basicsType,
  basicsInputs,
  basicsFeatureSet,
};
