const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    features: [PocketSide]
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    customizable: Boolean
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
    model: ID
    features: PocketSideInput
    image: Upload
    additionalPrice: Int
    available: Boolean
    customizable: Boolean
  }

  input PocketFilterInput{
    name:String
    model:[String]
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
