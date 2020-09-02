const modelType = `  
type Model {
    _id: ID!
    category: Category!,
    subcategory: Category,
    name: [Language],
    description: [Language],
    images: ImageSet,
    priority: Int,
    show: Boolean,
  }
`;

const modelInput = `
input ModelInput {
    category: ID!,
    subcategory: ID,
    name: [LanguageInput],
    description: [LanguageInput],
    images: ImageSetInput,
    priority: Int,
    show: Boolean,
  }`;

module.exports = {
  modelType,
  modelInput,
};
