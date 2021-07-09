const sizeType = `
  type Size {
    _id: ID!
    name: String!
    model: Model
    modelId: Model
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
    model: ID
    modelId: ID
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
