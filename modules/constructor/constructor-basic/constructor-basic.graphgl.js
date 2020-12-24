const constructorBasicType = `  
type ConstructorBasic {
    _id: ID!
    name: [Language],
    material:Material,
    image:String,
    basePrice: [CurrencySet]
    available: Boolean,
  }
`;

const constructorBasicInput = `  
input ConstructorBasicInput {
    name: [LanguageInput],
    material: ID,
    image:String,
    basePrice: Int
    available: Boolean,
  }
`;

module.exports = {
  constructorBasicType,
  constructorBasicInput,
};
