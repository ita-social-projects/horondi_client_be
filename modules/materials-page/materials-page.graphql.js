const MaterialsBlock = `
type MaterialsBlock {
    _id: ID!
    title: String
    type: String!
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
    title: String
    type: String
    text: [LanguageInput]
  }
`;

module.exports = { MaterialsBlock, MaterialsBlockInput };
