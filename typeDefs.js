const { gql } = require('apollo-server');
const { newsType, newsInput } = require('./modules/news/news.graphql');
const { userType, userInput } = require('./modules/user/user.graphql');
const {
  productsType,
  productsInput,
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
  commentsType,
  commentsInput,
} = require('./modules/comment/comment.graphql');

const typeDefs = gql`
  ${categoryType}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternsType}
  ${userType}
  ${productsType}
  ${commentsType}

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
    simpleName: String
  }

  type ProductOptions {
    size: Size
    bottomMaterial: BottomMaterial
    bottomColor: String
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
    weightInKg: Int
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

  type Query {
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID): Currency

    getAllCategories: [Category!]!
    getCategoryById(id: ID): Category

    getAllMaterials: [Material!]!
    getMaterialById(id: ID): Material

    getAllPatterns: [Pattern!]!
    getPatternById(id: ID): Pattern

    getAllNews: [News!]!
    getNewsById(id: ID): News

    getAllUsers: [User]
    getUserByToken: User
    getUserById(id: ID!): User

    getProductsById(id: ID!): Products
    getProducts(
      filter: FilterInput
      limit: Int
      skip: Int
      search: String
      sort: SortInput
    ): [Products]!

    getAllComments: [Comments]
    getCommentById(id: ID!): Comments
    getAllCommentsByProduct(id: ID!): [Comments]
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
  }

  input RoleEnumInput {
    role: String
  }

  input PrimaryImageInput {
    primary: ImageSetInput!
    additional: [ImageSetInput!]
  }

  input AuthorInput {
    name: String!
    image: ImageSetInput
  }

  ${categoryInput}
  ${currencyInput}
  ${materialInput}
  ${newsInput}
  ${patternsInput}
  ${userInput}
  ${productsInput}
  ${commentsInput}

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
    deleteMaterial(id: ID!): Material
    updateMaterial(id: ID!, material: MaterialInput!): Material

    "Category Mutation"
    addCategory(category: CategoryInput!): Category
    deleteCategory(id: ID!): Category
    updateCategory(id: ID!, category: CategoryInput!): Category

    "Currency Mutation"
    addCurrency(currency: CurrencyInput!): Currency
    deleteCurrency(id: ID!): Currency
    updateCurrency(id: ID!, currency: CurrencyInput!): Currency

    "News Mutation"
    addNews(news: NewsInput!): News
    deleteNews(id: ID!): News
    updateNews(id: ID!, news: NewsInput!): News

    "User Mutation"
    registerUser(user: UserInput!): User
    loginUser(user: UserInput!): User
    deleteUser(id: ID!): User
    updateUserById(user: UserInput!, id: ID!): User
    updateUserByToken(user: UserInput!): User

    "Products Mutation"
    addProduct(product: productsInput!): Products
    deleteProduct(id: ID!): Products
    updateProduct(id: ID!, product: productsInput!): Products

    "Comments Mutation"
    addComment(comment: commentsInput!): Comments
    deleteComment(id: ID!): Products
    updateComment(id: ID!, product: commentsInput!): Comments
  }
`;

module.exports = typeDefs;
