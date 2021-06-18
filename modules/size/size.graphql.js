const sizeType = `
  type Size {
    _id: ID!
    name: String!
    simpleName:[Language]!
    model: Model
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: [AdditionalCurrencySet]!
  }
  type SizeItems {
    items:[Size]
    count:Int
   }
`;

const sizeInput = `
  input SizeInput {
    name: String!
    simpleName: [LanguageInput]!
    model: ID
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: additionalPriceInput!
  }
  input SizeFilterInput{
    available:[String]
    searchBySimpleName:String
    name:[String]
  }
`;

module.exports = {
  sizeType,
  sizeInput,
};
