const patternType = `
    type Pattern {
    _id: ID!
    name: [Language]
    description: [Language]
    images: ImageSet
    material: String
    handmade: Boolean
    available: Boolean
    }
`;

const patternInput = `
    input PatternInput {
    name: [LanguageInput]
    description: [LanguageInput]
    images:ImageSetInput
    material: String
    handmade: Boolean
    available: Boolean
    }
`;

module.exports = { patternType, patternInput };
