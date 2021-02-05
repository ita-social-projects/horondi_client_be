const sharedFields = `
  _id: ID!
  code: String!
  name: [Language]
  images: ImageSet
  available: Boolean
`;
const categoryType = `
  type Category {
    ${sharedFields}
  }
  type CategoryWithModels {
    ${sharedFields}
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
