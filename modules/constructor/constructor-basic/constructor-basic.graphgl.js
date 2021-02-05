const constructorBasicType = `  
type ConstructorBasic {
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

const constructorBasicInput = `  
input ConstructorBasicInput {
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
  constructorBasicType,
  constructorBasicInput,
};
