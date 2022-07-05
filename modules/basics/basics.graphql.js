const basicsType = `
    type Basics {
        _id: ID!
        name: [Language]
        images: ImageSet
        available: Boolean
        features: basicsFeatureSet
        absolutePrice: Int
        relativePrice: Int
        translationsKey: ID
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
        absolutePrice: Int
        relativePrice: Int
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
