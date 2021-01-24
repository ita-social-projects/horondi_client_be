const productImagesType = `
  type ProductImages { 
    primary: ImageSet
    additional: [ImageSet]
  }
`;

const productType = `
${productImagesType}
type Product {
_id: ID!
category: Category!
model: Model!
name: [Language]!
description: [Language]!
mainMaterial: ProductMaterialType!
innerMaterial: ProductMaterialType!
strapLengthInCm: Int!
images: ProductImages
closure: Closure
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
type ProductMaterialType{
  material: Material
  color: Color
}`;

const productInput = `
input ProductInput {
category: ID!
model: ID!
name: [LanguageInput]!
description: [LanguageInput]!
mainMaterial: ProductMaterialsInput!
innerMaterial: ProductMaterialsInput!
strapLengthInCm: Int!
pattern: ID!
closure: ID!
images: [Upload]
availableCount: Int
basePrice: Int!
available: Boolean
isHotItem: Boolean
options:[ProductOptionsInput]
}
input ProductMaterialsInput{
  material: ID
  color: ID
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
  cartProductInput,
  cartProductType,
};
