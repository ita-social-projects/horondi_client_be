const modelType = `  
type Model {
    _id: ID!
    category: Category!
    name: [Language]
    description: [Language]
    images: ImageSet
    priority: Int
    show: Boolean
    availableForConstructor: Boolean
    eligibleOptions: Option
    appliedOptions: AppliedOption
    restrictions: [Restriction]
    sizes: [Size]
    translationsKey: ID
  }
`;

const optionTypes = `
  type Option {
    constructorBasic:[ConstructorBasic]
    constructorPattern:[Pattern]
    constructorFrontPocket:[ConstructorFrontPocket]
    constructorBottom:[ConstructorBottom]
    constructorPocket: [Pocket]
    constructorBack: [Back]
    constrBottom: [Bottom]
    constructorClosure: [Closure]
    constructorStrap: [Strap]
  }

  type AppliedOption {
    constructorBasic: ConstructorBasic
    constructorPattern: Pattern
    constructorFrontPocket: ConstructorFrontPocket
    constructorBottom: ConstructorBottom
    constructorPocket: [Pocket]
    constructorBack: Back
    constrBottom: Bottom
    constructorClosure: Closure
    constructorStrap: Strap
  }
`;

const modelInputs = `
input ModelInput {
    category: ID!
    name: [LanguageInput]
    description: [LanguageInput]
    images: ImageSetInput
    priority: Int
    show: Boolean
    sizes: [SizeInput]
    availableForConstructor: Boolean
    eligibleOptions: OptionInput
    restrictions: [ID]
  }
  
input OptionInput {
  constructorBasic:[ID]
  constructorPattern:[ID]
  constructorFrontPocket:[ID]
  constructorBottom:[ID]
  constructorPocket: [ID]
  constructorBack: [ID]
  constrBottom: [ID]
  constructorClosure: [ID]
  constructorStrap: [ID]
}

input ModelFilterInput{
  search: String
  category:[String]
  available:[String]
  availableForConstructor:[String]
}
`;

const modelSortInput = `
input ModelSortInput {
  name: Int
  priority: Int
}
`;

module.exports = {
  modelType,
  optionTypes,
  modelSortInput,
  modelInputs,
};
