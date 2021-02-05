const productType = `
type Product {
_id: ID!
category: Category!
model: Model!
name: [Language]!
description: [Language]!
mainMaterial: ProductMaterialType!
innerMaterial: ProductMaterialType!
bottomMaterial: ProductMaterialType
strapLengthInCm: Int!
images: ProductImages
closure: Closure
pattern: Pattern
basePrice: [CurrencySet]!
sizes: [Size]!
available: Boolean!
isHotItem: Boolean
purchasedCount: Int
availableCount: Int
rate: Float
rateCount: Int
userRates: [UserRate]
comments: PaginatedComments!
}
type ProductsFilter {
categories: [Category]
models: [Model]
patterns: [Pattern]
closures: [Closure]
mainMaterial: [Material]
mainMaterialColor: [Color]
innerMaterial: [Material]
innerMaterialColor: [Color]
bottomMaterial: [Material]
bottomMaterialColor: [Color]
}
type ProductMaterialType{
  material: Material
  color: Color
}
type ProductImages { 
  primary: ImageSet
  additional: [ImageSet]
}
`;

const productInput = `
  input ProductInput {
    category: ID!
    model: ID!
    name: [LanguageInput]!
    description: [LanguageInput]!
    mainMaterial: ProductMaterialsInput!
    innerMaterial: ProductMaterialsInput!
    bottomMaterial: ProductMaterialsInput
    strapLengthInCm: Int!
    pattern: ID!
    closure: ID!
    sizes:[ID]!
    images: [Upload]
    availableCount: Int
    basePrice: Int!
    available: Boolean
    isHotItem: Boolean
  }
  input ProductMaterialsInput{
    material: ID
    color: ID
  }
`;

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
  }
`;
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
  }
`;

module.exports = {
  productType,
  productInput,
  cartProductInput,
  cartProductType,
};
