const { gql } = require('apollo-server');
const { newsType, newsInput } = require('./modules/news/news.graphql');
const {
  userType,
  userInput,
  userRegisterInput,
  userLoginInput,
} = require('./modules/user/user.graphql');
const {
  productType,
  productInput,
} = require('./modules/product/product.graphql');
const {
  categoryType,
  categoryInput,
} = require('./modules/category/category.graphql');
const {
  materialType,
  materialInput,
} = require('./modules/material/material.graphql');
const {
  patternsType,
  patternsInput,
} = require('./modules/pattern/pattern.graphql');
const {
  currencyType,
  currencyInput,
} = require('./modules/currency/currency.graphql.js');
const {
  commentType,
  commentInput,
} = require('./modules/comment/comment.graphql');

const typeDefs = gql`
  ${categoryType}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternsType}
  ${userType}
  ${productType}
  ${commentType}

  enum RoleEnum {
    admin
    user
  }
  type Language {
    lang: String!
    value: String!
  }
  type ImageSet {
    large: String
    medium: String
    small: String
    thumbnail: String
  }
  type Credential {
    source: String
    tokenPass: String
  }
  type Address {
    country: String
    city: String
    street: String
    buildingNumber: String
    appartment: String
  }
  type PrimaryImage {
    primary: ImageSet
    additional: [ImageSet]
  }
  type ConvertOption {
    name: String
    exchangeRate: Float
  }
  type Subcategory {
    _id: ID!
    categoryCode: String
    name: [Language]
    images: ImageSet
    available: Boolean
  }
  type Author {
    name: [Language]
    image: ImageSet
  }
  type Color {
    code: Int
    name: [Language]
    images: ImageSet
    available: Boolean
    simpleName: [Language]
  }

  type ProductOptions {
    size: Size
    bottomMaterial: BottomMaterial
    bottomColor: [Language]
    availableCount: Boolean
    additions: [ProductAdditions]
  }

  type ProductAdditions {
    name: [Language]
    description: [Language]
    available: Boolean
    additionalPrice: Int
  }

  type Size {
    name: String
    heightInCm: Int
    widthInCm: Int
    depthInCm: Int
    volumeInLiters: Int
    weightInKg: Float
    available: Boolean
    additionalPrice: Int
  }

  type BottomMaterial {
    name: [Language]
    description: [Language]
    colors: [Color]
    available: Boolean
    additionalPrice: Int
  }
  type Error {
    statusCode: Int
    message: String
  }

  union CategoryResult = Category | Error
  union CurrencyResult = Currency | Error
  union MaterialResult = Material | Error
  union PatternResult = Pattern | Error
  union NewsResult = News | Error
  union ProductResult = Product | Error
  union CommentResult = Comment | Error

  type Query {
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID): CurrencyResult

    getAllCategories: [Category]
    getCategoryById(id: ID): CategoryResult

    getAllMaterials: [Material!]!
    getMaterialById(id: ID): MaterialResult

    getAllPatterns: [Pattern!]!
    getPatternById(id: ID): PatternResult

    getAllNews: [News!]!
    getNewsById(id: ID): NewsResult

    getAllUsers: [User]
    getUserByToken: User
    getUserById(id: ID!): User

    getProductById(id: ID!): ProductResult
    getProducts(
      filter: FilterInput
      limit: Int
      skip: Int
      search: String
      sort: SortInput
    ): [ProductResult]!

    getCommentById(id: ID!): CommentResult
    getAllCommentsByProduct(id: ID!): [CommentResult]
  }

  input SortInput {
    purchasedCount: Int
    basePrice: Int
    rate: Int
    isHotItem: Boolean
  }

  input FilterInput {
    pattern: [String]
    materials: [String]
    colors: [String]
    price: [Int]
    category: [String]
  }
  input RoleEnumInput {
    role: String
  }
  input PrimaryImageInput {
    primary: ImageSetInput!
    additional: [ImageSetInput!]
  }
  input AuthorInput {
    name: [LanguageInput]
    image: ImageSetInput
  }
  ${categoryInput}
  ${currencyInput}
  ${materialInput}
  ${newsInput}
  ${patternsInput}
  ${userInput}
  ${productInput}
  ${commentInput}
  ${userLoginInput}
  ${userRegisterInput}

  input LanguageInput {
    lang: String!
    value: String!
  }
  input AddressInput {
    country: String
    city: String
    street: String
    buildingNumber: String
    appartment: String
  }
  input ImageSetInput {
    large: String
    medium: String
    small: String
    thumbnail: String
  }
  input ColorInput {
    code: Int!
    name: [LanguageInput!]
    images: ImageSetInput
    available: Boolean!
  }
  input ConvertOptionInput {
    name: String!
    exchangeRate: Float!
  }
  input SubcategoryInput {
    categoryCode: String!
    name: [LanguageInput!]
    images: ImageSetInput
    available: Boolean!
  }
  input CredentialInput {
    source: String
    tokenPass: String
  }

  type Mutation {
    "Pattern Mutations"
    addPattern(pattern: PatternInput!): Pattern
    deletePattern(id: ID!): Pattern
    updatePattern(id: ID!, pattern: PatternInput!): Pattern
    "Material Mutation"
    addMaterial(material: MaterialInput!): Material
    deleteMaterial(id: ID!): MaterialResult
    updateMaterial(id: ID!, material: MaterialInput!): MaterialResult

    "Category Mutation"
    addCategory(category: CategoryInput!): Category
    deleteCategory(id: ID!): CategoryResult
    updateCategory(id: ID!, category: CategoryInput!): CategoryResult

    "Currency Mutation"
    addCurrency(currency: CurrencyInput!): Currency
    deleteCurrency(id: ID!): CurrencyResult
    updateCurrency(id: ID!, currency: CurrencyInput!): CurrencyResult

    "News Mutation"
    addNews(news: NewsInput!): NewsResult
    deleteNews(id: ID!): NewsResult
    updateNews(id: ID!, news: NewsInput!): NewsResult

    "User Mutation"
    registerUser(user: userRegisterInput!): User
    loginUser(user: userLoginInput!): User
    deleteUser(id: ID!): User
    updateUserById(user: UserInput!, id: ID!): User
    updateUserByToken(user: UserInput!): User

    "Product Mutation"
    addProduct(product: productInput!): Product
    deleteProduct(id: ID!): Product
    updateProduct(id: ID!, product: productInput!): Product

    "Comment Mutation"
    addComment(comment: commentInput!): Comment
    deleteComment(id: ID!): Comment
    updateComment(id: ID!, product: commentInput!): Comment
  }
`;

module.exports = typeDefs;
