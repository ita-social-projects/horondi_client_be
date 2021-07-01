const pocketType = `
  type Pocket {
    _id: ID!
    name: [Language]
    optionType: OptionTypeEnum
    model: Model
    images: ImageSet
    additionalPrice: [CurrencySet]
    restriction: Boolean
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
    additionalPrice: Int
  }

  input PocketFilterInput{
    search: String
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
