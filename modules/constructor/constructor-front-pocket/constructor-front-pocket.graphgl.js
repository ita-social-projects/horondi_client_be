const constructorFrontPocketType = `  
type ConstructorFrontPocket {
    _id: ID!
    name: [Language],
    material:Material!,
    images:ImageSet,
    basePrice: [CurrencySet]
    available: Boolean,
  }
`;

const constructorFrontPocketInput = `  
input ConstructorFrontPocketInput {
    name: [LanguageInput],
    material: ID!,
    images:ImageSetInput,
    basePrice: Int
    available: Boolean,
  }
`;

module.exports = {
  constructorFrontPocketType,
  constructorFrontPocketInput,
};
