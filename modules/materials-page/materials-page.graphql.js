const MaterialsBlock = `
type MaterialsBlock {
    _id: ID!
    image: String
    text: [Language]!
    translationsKey: ID!
  }

  type PaginatedMaterialsBlock {
    items: [MaterialsBlock]
    count: Int
  }
`;

const MaterialsBlockInput = `
input MaterialsBlockInput {
    image: String
    text: [LanguageInput]
  }
`;

module.exports = { MaterialsBlock, MaterialsBlockInput };
