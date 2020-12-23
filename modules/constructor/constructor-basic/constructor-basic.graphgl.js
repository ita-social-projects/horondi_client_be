const constructorBasicType = `  
type ConstructorBasic {
    _id: ID!
    name: [Language],
    material:Material,
    images:ImageSet,
    basePrice: [CurrencySet]
    available: Boolean,
  }
`;

const constructorBasicInput = `  
input ConstructorBasicInput {
    name: [LanguageInput],
    material: ID,
    images:ImageSetInput,
    basePrice: Int
    available: Boolean,
  }
`;

module.exports = {
  constructorBasicType,
  constructorBasicInput,
};
