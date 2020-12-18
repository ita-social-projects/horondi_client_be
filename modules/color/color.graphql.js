const colorType = `
  type Color {
    _id: ID!
    name: [Language]
    colorHex: String
    available: Boolean
    simpleName: [Language]
  }
`;

const colorInput = `
  input ColorInput {
    name: [LanguageInput!]
    colorHex: String!
    available: Boolean!
    simpleName: [LanguageInput!]
  }
`;

module.exports = {
  colorType,
  colorInput,
};
