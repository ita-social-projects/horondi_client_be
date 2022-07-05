const MaterialsBlock = `
type MaterialsBlock {
    _id: ID!
    title: String
    type: String!
    image: ImageSet
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
    image: Upload
    title: String
    type: String
    text: [LanguageInput]
  }

    input MaterialsFilterInput{
    search:String
  }
`;

module.exports = { MaterialsBlock, MaterialsBlockInput };
