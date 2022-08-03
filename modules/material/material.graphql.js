const materialType = `
  type Material {
    _id: ID!
    name: [Language]
    description: [Language]
    purpose: PurposeEnum
    colors: [Color]
    available: Boolean
    absolutePrice: Int
    relativePrice: Int
    translationsKey: ID!
  }
  type MaterialByPurpose {
    basic: [Material]
    inner: [Material]
    bottom: [Material]
    back: [Material]
    pattern: [Material]
    strap: [Material]
  }

  enum PurposeEnum{
    basic
    inner
    bottom
    pattern
    strap
    back
  }
`;

const materialInput = `
    input MaterialInput {
      name: [LanguageInput]
      description: [LanguageInput]
      purpose: PurposeEnum!
      colors: [ID!]
      available: Boolean
      absolutePrice: Int
      relativePrice: Int
    }
`;

const materialFilterInput = `
  input MaterialFilterInput {
    colors: [String]
    available:[String]
    purpose:[String]
    name:String
  }
`;

module.exports = {
  materialType,
  materialInput,
  materialFilterInput,
};
