const modelType = `  
type Model {
    _id: ID!
    category: Category!,
    name: [Language],
    description: [Language],
    images: ImageSet,
    priority: Int,
    show: Boolean,
    availableForConstructor: Boolean,
    constructorPattern:[Pattern],
    constructorFrontPocket:[ConstructorFrontPocket],
    constructorBottom:[ConstructorBottom]
    sizes: [Size]
  }
`;
const modelInput = `
input ModelInput {
    category: ID!,
    name: [LanguageInput],
    description: [LanguageInput],
    images: ImageSetInput,
    priority: Int,
    show: Boolean,
    sizes: [SizeInput]
    availableForConstructor: Boolean,
    constructorBasic:[ID],
    constructorPattern:[ID],
    constructorBottom:[ID]
  }`;

module.exports = {
  modelType,
  modelInput,
};
