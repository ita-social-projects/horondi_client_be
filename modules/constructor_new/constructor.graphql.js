const constructorType = `
  type Constructor {
    _id: ID
    name: [Language]
    model: Model
    basics: [Basics]
    bottoms: [Bottom]
    patterns: [Pattern]
    backs: [Back]
    straps: [Strap]
    closures: [Closure]
    pockets: [Pocket]
    images: ImageSet
  }
`;

const constructorInputs = `
  input ConstructorInput {
    name: [LanguageInput!]
    model: ID!
    basics: [ID!]
    bottoms: [ID!]
    patterns: [ID!]
    backs: [ID!]
    straps: [ID!]
    closures: [ID!]
    pockets: [ID!]
    image: Upload
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
