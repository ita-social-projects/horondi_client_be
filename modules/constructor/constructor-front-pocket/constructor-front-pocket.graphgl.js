const constructorFrontPocketType = `  
type ConstructorFrontPocket {
    _id: ID!
    name: [Language],
    material:Material,
    color:Color,
    image:String,
    basePrice: [CurrencySet]
    available: Boolean,
    default:Boolean,
  }
`;

const constructorFrontPocketInput = `  
input ConstructorFrontPocketInput {
    name: [LanguageInput],
    material: ID,
    color:ID,
    image:String,
    basePrice: Int
    available: Boolean,
    default:Boolean,
  }
`;

module.exports = {
  constructorFrontPocketType,
  constructorFrontPocketInput,
};
