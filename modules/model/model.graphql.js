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
    sizes: [Size]
  }
`;

// restrictions: Restriction
const optionTypes = `
  type Option {
    constructorBasic:[ConstructorBasic]
    constructorPattern:[Pattern]
    constructorFrontPocket:[ConstructorFrontPocket]
    constructorBottom:[ConstructorBottom]
    constructorPocket: [Pocket]
    constructorBack: [Back]
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
    constructorClosure: Closure
    constructorStrap: Strap
  }
`;

const modelInputs = `
input ModelInput {
    category: ID!,
    name: [LanguageInput],
    description: [LanguageInput],
    images: ImageSetInput,
    priority: Int,
    show: Boolean,
    sizes: [ID]
    availableForConstructor: Boolean,
    eligibleOptions: OptionInput
  }
  
input OptionInput {
  constructorBasic:[ID],
  constructorPattern:[ID],
  constructorFrontPocket:[ID]
  constructorBottom:[ID]
  constructorPocket: [ID]
  constructorBack: [ID]
  constructorClosure: [ID]
  constructorStrap: [ID]
}
  
`;

module.exports = {
  modelType,
  optionTypes,
  modelInputs,
};
