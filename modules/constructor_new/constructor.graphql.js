const constructorType = `
  type CurrentPocketWithPosition {
    pocket: Pocket
    position: Position
  }
  
  type otherPocketWithAvailablePositions {
    pocket: Pocket
    position: [Position]
  }
  
  type PocketsWithRestrictions {
    currentPocketWithPosition: CurrentPocketWithPosition
    otherPocketsWithAvailablePositions: [otherPocketWithAvailablePositions]
  }

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
    pocketsWithRestrictions: [PocketsWithRestrictions]
  }
`;

const constructorInputs = `
  input currentPocketWithPositionInput{
    pocket: ID!
    position: ID!
  }
  
  input otherPocketsWithAvailablePositionsInput{
    pocket: ID!
    position: ID!
  }
  
  input PocketsWithRestrictionsInput {
    currentPocketWithPosition: currentPocketWithPositionInput!
    otherPocketsWithAvailablePositions: [otherPocketsWithAvailablePositionsInput!]
  }
  
  input ConstructorInput {
    name: [LanguageInput!]!
    model: ID!
    image: Upload
    basics: [ID!]
    bottoms: [ID!]
    patterns: [ID!]
    backs: [ID!]
    straps: [ID!]
    closures: [ID!]
    pocketsWithRestrictions: [PocketsWithRestrictionsInput!]
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
