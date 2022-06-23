const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    images: ImageSet
    absolutePrice: Int
    restriction: Boolean
    positions: [Position]
    translationsKey: ID
  }
`;

const pocketSide = `
    type PocketSide {
     side: [SideEnum]
    }
`;

const pocketSideInput = `
    input PocketSideInput {
     side: [String]
    }
`;

const sideEnum = `
    enum SideEnum {
      LEFT
      RIGHT
      FRONT
      BACK
    }
`;

const pocketInputs = `
  input PocketInput {
    name: [LanguageInput]
    optionType: String
    restriction: Boolean
    images: ImageSetInput
    absolutePrice: Int!
    positions: [ID]
  }

  input PocketFilterInput{
    search: String
    name:String
    available:[String]
    side:[String]
  }
`;

module.exports = {
  pocketType,
  pocketInputs,
  pocketSide,
  pocketSideInput,
  sideEnum,
};
