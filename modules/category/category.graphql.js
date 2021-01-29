const categoryType = `
  type Category {
  _id: ID!
  code: String!
  name: [Language]
  images: ImageSet
  available: Boolean
}
  type CategoryWithModels {
    _id: ID!
    code: String!
    name: [Language]
    images: ImageSet
    available: Boolean
    models: [Model]
  }
`;

const categoryInput = `
  input CategoryInput {
    code: String
    name: [LanguageInput]
    images: ImageSetInput
    available: Boolean
  }`;

module.exports = { categoryType, categoryInput };
