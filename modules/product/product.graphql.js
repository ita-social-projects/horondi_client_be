const productType = `
  type Product {
    _id: ID!
    isFromConstructor: Boolean
    category: Category
    model: Model!
    name: [Language]!
    description: [Language]
    mainMaterial: ProductMaterialType!
    innerMaterial: ProductMaterialType
    bottomMaterial: ProductMaterialType
    backMaterial: ProductMaterialType
    strapLengthInCm: Int
    images: ProductImages
    closure: Closure
    pattern: Pattern
    basePrice: [CurrencySet]!
    sizes: [FinalPricesForSizes]!
    available: Boolean!
    isHotItem: Boolean
    purchasedCount: Int
    availableCount: Int
    rate: Float
    rateCount: Int
    userRates: [UserRate]
    comments: PaginatedComments!
    translationsKey: ID!
  }
  type ProductMaterialType{
    material: Material
    color: Color
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
    backMaterial: [Material]
    backMaterialColor: [Color]
    maxPrice: [CurrencySet]
    minPrice: [CurrencySet]
    translationsKey: ID!
   }
  type ProductImages { 
    primary: ImageSet
    additional: [ImageSet]
  }
`;

const productInput = `
  input ProductInput {
    category: ID
    model: ID!
    name: [LanguageInput]!
    description: [LanguageInput]
    mainMaterial: ProductMaterialsInput!
    innerMaterial: ProductMaterialsInput
    bottomMaterial: ProductMaterialsInput
    backMaterial: ProductMaterialsInput
    strapLengthInCm: Int
    pattern: ID
    closure: ID
    sizes:[ID]!
    images: [Upload]
    availableCount: Int
    basePrice: Float!
    available: Boolean
    isHotItem: Boolean
    translationsKey: ID
  }
  input ProductMaterialsInput{
    material: ID
    color: ID
  }
`;

module.exports = {
  productType,
  productInput,
};
