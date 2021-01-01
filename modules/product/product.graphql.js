const productType = `
type Product {
_id: ID!
category: Category!
model: Model!
name: [Language]!
description: [Language]!
mainMaterial: [ID]!
innerMaterial: [ID]!
strapLengthInCm: Int!
images: [ImageSet]
colors: [Color]!
pattern: Pattern
basePrice: [CurrencySet]!
options: [ProductOptions]!
available: Boolean!
isHotItem: Boolean
purchasedCount: Int
availableCount: Int
rate: Float
rateCount: Int
userRates: [UserRate]
comments: PaginatedComments!
}
`;

const productInput = `
input ProductInput {
category: ID!
model: ID!
name: [LanguageInput]!
description: [LanguageInput]!
mainMaterial: [ID]!
innerMaterial: [ID]!
strapLengthInCm: Int!
colors: [ID]! 
pattern: ID
images: [Upload]
availableCount: Int
basePrice: Int!
available: Boolean
isHotItem: Boolean
options:[ProductOptionsInput]
}`;

const cartProductType = `
type CartProduct{
  _id: ID!
  name: [Language]
  bagBottom: CartProductBagBottom
  dimension: CartProductDimensions
  image: String
  totalPrice: [CurrencySet]
  quantity: Int
  selectedSize: String
  sidePocket: Boolean
}`;

const cartProductInput = `
input CartProductInput {
_id: ID!
name: [LanguageInput]
bagBottom: CartProductBagBottomInput
dimensions: CartProductDimensionsInput
image: String
totalPrice: [CurrencySetInput]
quantity: Int
selectedSize: String
sidePocket: Boolean
}`;

module.exports = {
  productType,
  productInput,
  cartProductType,
  cartProductInput,
};
