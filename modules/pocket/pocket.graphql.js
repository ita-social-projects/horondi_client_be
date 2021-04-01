const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    type: String
    model: Model
    features: [PocketSide]
    blocker: [Blocker]
    image: String
    additionalPrice: [CurrencySet]
    available: Boolean
    default: Boolean
  }
`;

const pocketSide = `
    type PocketSide {
     side: SideEnum
    }
`;

const pocketSideInput = `
    input PocketSideInput {
     side: String
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

const pocketInput = `
  input PocketInput {
    name: [LanguageInput]
    type: String
    model: ID
    features: [PocketSideInput]
    blocker: [BlockerInput]
    image: Upload
    additionalPrice: Int
    available: Boolean
    default: Boolean
  }
`;

module.exports = {
  pocketType,
  pocketInput,
  pocketSide,
  pocketSideInput,
  sideEnum,
};
