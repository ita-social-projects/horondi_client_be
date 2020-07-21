const { gql } = require('apollo-server');
const { newsType, newsInput } = require('./modules/news/news.graphql');
const { userType, userInput } = require('./modules/user/user.graphql');
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

const typeDefs = gql`
  ${categoryType}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternsType}
  ${userType}

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

  type Query {
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID, language: Int!): CurrencyResult

    getAllCategories: [Category]
    getCategoryById(id: ID, language: Int!): CategoryResult

    getAllMaterials: [Material!]!
    getMaterialById(id: ID, language: Int!): MaterialResult

    getAllPatterns: [Pattern!]!
    getPatternById(id: ID, language: Int!): PatternResult

    getAllNews: [News!]!
    getNewsById(id: ID, language: Int!): NewsResult

    getAllUsers: [User]
    getUserByToken: User
    getUserById(id: ID!): User
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
    deletePattern(id: ID!, language: Int!): Pattern
    updatePattern(id: ID!, pattern: PatternInput!, language: Int!): Pattern

    "Material Mutation"
    addMaterial(material: MaterialInput!): Material
    deleteMaterial(id: ID!, language: Int!): MaterialResult
    updateMaterial(
      id: ID!
      material: MaterialInput!
      language: Int!
    ): MaterialResult

    "Category Mutation"
    addCategory(category: CategoryInput!): Category
    deleteCategory(id: ID!, language: Int!): CategoryResult
    updateCategory(
      id: ID!
      category: CategoryInput!
      language: Int!
    ): CategoryResult

    "Currency Mutation"
    addCurrency(currency: CurrencyInput!): Currency
    deleteCurrency(id: ID!, language: Int!): CurrencyResult
    updateCurrency(
      id: ID!
      currency: CurrencyInput!
      language: Int!
    ): CurrencyResult

    "News Mutation"
    addNews(news: NewsInput!): News
    deleteNews(id: ID!, language: Int!): NewsResult
    updateNews(id: ID!, news: NewsInput!, language: Int!): NewsResult

    "User Mutation"
    registerUser(user: UserInput!): User
    loginUser(user: UserInput!): User
    deleteUser(id: ID!): User
    updateUserById(user: UserInput!, id: ID!): User
    updateUserByToken(user: UserInput!): User
  }
`;

module.exports = typeDefs;
