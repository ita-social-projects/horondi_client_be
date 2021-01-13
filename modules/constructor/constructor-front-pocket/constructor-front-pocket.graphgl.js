const constructorFrontPocketType = `  
type ConstructorFrontPocket {
    _id: ID!
    name: [Language],
    material:Material,
    image:String,
    basePrice: [CurrencySet]
    available: Boolean,
  }
`;

const constructorFrontPocketInput = `  
input ConstructorFrontPocketInput {
    name: [LanguageInput],
    material: ID,
    image:String,
    basePrice: Int
    available: Boolean,
  }
`;

module.exports = {
  constructorFrontPocketType,
  constructorFrontPocketInput,
};
