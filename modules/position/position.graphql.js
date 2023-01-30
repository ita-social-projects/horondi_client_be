const positionType = `
  type Position{
    _id: ID!
    name: [Language]
    available: Boolean
    translationsKey: ID
    optionType: OptionTypeEnum
  }
`;

const positionInputs = `
  input PositionInput{
    name: [LanguageInput!]
    available: Boolean
    optionType: String
  }

  input PositionsFilterInput{
    search: String
    name: String
  }
`;

module.exports = {
  positionType,
  positionInputs,
};
