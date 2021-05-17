const sizeType = `
  type Size {
    _id: ID!
    name: String!
    simpleName:[Language]!
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: [CurrencySet]!
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
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    additionalPrice: Int!
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
