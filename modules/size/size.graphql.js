const sizeType = `
  type Size {
    _id: ID
    name: String!
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    absolutePrice: Int
    relativePrice: Int
  }
  type SizeItems {
    items:[Size]
    count:Int
   }
`;

const sizeInput = `
  input SizeInput {
    _id: String
    name: String!
    heightInCm: Int!
    widthInCm: Int!
    depthInCm: Int!
    volumeInLiters: Int!
    weightInKg: Float!
    available: Boolean!
    absolutePrice: Int
    relativePrice: Int
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
