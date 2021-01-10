const colorType = `
  type Color {
    _id: ID!
    name: [Language]
    colorHex: String
    simpleName: [Language]
  }
`;

const colorInput = `
  input ColorInput {
    name: [LanguageInput!]
    colorHex: String!
    simpleName: [LanguageInput!]
  }
`;

module.exports = {
  colorType,
  colorInput,
};
