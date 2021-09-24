const constructorType = `
  type Constructor {
    _id: ID
    name: [Language]
    images: ImageSet
    model: Model
    basics: [Basics]
    bottoms: [Bottom]
    patterns: [Pattern]
    backs: [Back]
    straps: [Strap]
    closures: [Closure]
    pockets: [Pocket]
  }
`;

const constructorInputs = `  
  input ConstructorInput {
    name: [LanguageInput!]
    model: ID!
    image: Upload
    basics: [ID!]
    bottoms: [ID!]
    patterns: [ID!]
    backs: [ID!]
    straps: [ID!]
    closures: [ID!]
    pockets: [ID!]
  }

  input ConstructorFilterInput{
    name:String
    model:[String]
  }
`;

module.exports = {
  constructorType,
  constructorInputs,
};
