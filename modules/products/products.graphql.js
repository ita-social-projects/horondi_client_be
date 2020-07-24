const productsType = `
type Products {
_id: ID!
name: [Language]
description: [Language]
mainMaterial: [Language]
innerMaterial: [Language]
strapLengthInCm: Int
images: [PrimaryImage]
colors: [Color]
pattern: [Language]
patternImages: ImageSet
closure: [Language]
closureColor: String
basePrice: Int
available: Boolean
isHotItem: Boolean
purchasedCount: Int
rate: Float
rateCount: Int
subcategory: Category
comments: [ID!]
votedUsers: [ID!]
}
`;

const productsInput = `
input productsInput {
name: [LanguageInput]
description: [LanguageInput]
mainMaterial: [LanguageInput]
innerMaterial: [LanguageInput]
strapLengthInCm: Int
images: [PrimaryImageInput]
colors: [ColorInput]
pattern: [LanguageInput]
patternImages: ImageSetInput
closure: [LanguageInput]
closureColor: String
basePrice: Int
available: Boolean
isHotItem: Boolean
purchasedCount: Int
rate: Float
rateCount: Int
}`;

module.exports = {
  productsType,
  productsInput,
};
