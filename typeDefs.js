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
  }
`;

module.exports = typeDefs;
