const positionType = `
  type Position {
    _id: ID!
    name: [Language]
    available: Boolean
  }
`;

const positionInputs = `
  input PositionInput {
    name: [LanguageInput!]
    available: Boolean
  }
`;

module.exports = {
  positionType,
  positionInputs,
};
