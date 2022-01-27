const MaterialsBlock = `
type MaterialsBlock {
    _id: ID!
    image: String
    text: [Language]!
    translationsKey: ID!
  }
`;

const MaterialsBlockInput = `
input MaterialsBlockInput {
    image: String
    text: [LanguageInput]
  }
`;

module.exports = { MaterialsBlock, MaterialsBlockInput };
