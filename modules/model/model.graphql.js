const modelType = `  
type Model {
    _id: ID!
    category: Category!,
    name: [Language],
    description: [Language],
    images: ImageSet,
    priority: Int,
    show: Boolean,
<<<<<<< HEAD
    sizes: [Size]
=======
    availableForConstructor: Boolean,
    constructorBasic:[ConstructorBasic],
    constructorPattern:[Pattern],
    constructorFrontPocket:[ConstructorFrontPocket],
    constructorBottom:[ConstructorBottom]
>>>>>>> c141941cc80406f41d0d352e4e1100b5a9a4ec3f
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
<<<<<<< HEAD
    sizes: [SizeInput]
=======
    availableForConstructor: Boolean,
    constructorBasic:[ID],
    constructorPattern:[ID],
    constructorBottom:[ID]
>>>>>>> c141941cc80406f41d0d352e4e1100b5a9a4ec3f
  }`;

module.exports = {
  modelType,
  modelInput,
};
