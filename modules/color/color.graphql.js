const colorType = `
  type Color {
    _id: ID!
    name: [Language]
    colorHex: String
    simpleName: [Language]
    translations_key: ID
  }
`;

const colorInput = `
  input ColorInput {
    name: [LanguageInput!]
    colorHex: String!
    simpleName: [LanguageInput!]
    translations_key: ID
  }
`;

module.exports = {
  colorType,
  colorInput,
};
