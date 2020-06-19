const { gql } = require('apollo-server');
const {
  categoryType,
  categoryInput,
} = require('./modules/categories/categories.model');
const {
  materialType,
  materialInput,
} = require('./modules/materials/materials.model');
const {
  patternsType,
  patternsInput,
} = require('./modules/patterns/patterns.model');
const {
  currencyType,
  currencyInput,
} = require('./modules/currencies/currencies.model');

const typeDefs = gql`
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

  type PrimaryImage {
    primary: ImageSet!
    additional: [ImageSet!]
  }

  type ConvertOption {
    name: String!
    exchangeRate: Float!
  }

  type Currency {
    ${currencyType}
  }

  type Subcategory {
    _id: ID!
    categoryCode: String!
    name: [Language!]
    images: ImageSet
    available: Boolean!
  }

  type Category {
    ${categoryType}
  }

  type Author {
    name: String!
    image: ImageSet
  }

  type News {
    _id: ID!
    title: [Language!]
    text: [Language!]
    images: [PrimaryImage!]
    video: String!
    author: Author!
    date: String!
  }

  type Color {
    code: Int!,
    name: [Language!],
    images: ImageSet,
    available: Boolean!,
  }

  type Material {
    ${materialType}
  }

  type Pattern {
    ${patternsType}
  }

  type Query {
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID): Currency

    getAllCategories: [Category!]!
    getCategoryById(id: ID): Category

    allNews: [News!]!
    oneNews(id: ID): News

    getAllMaterials: [Material!]!
    getMaterialById(id: ID): Material

    getAllPatterns: [Pattern!]!
    getPatternById(id: ID): Pattern
  }

  input LanguageInput {
    lang: String!
    value: String!
  }

  input PatternInput {
    ${patternsInput}
  }

  input ImageSetInput {
    large: String
    medium: String
    small: String
    thumbnail: String
  }

  input MaterialInput {
    ${materialInput}
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

  input CurrencyInput {
    ${currencyInput}
  }

  input CategoryInput {
    ${categoryInput}
  }

  input SubcategoryInput {
    categoryCode: String!
    name: [LanguageInput!]
    images: ImageSetInput
    available: Boolean!
  }

  type Mutation {
    "Pattern Mutations"
    addPattern(pattern: PatternInput!): Pattern
    deletePattern(id: ID!): Pattern

    "Material Mutation"
    addMaterial(material: MaterialInput!): Material
    deleteMaterial(id: ID!): Material

    "Category Mutation"
    addCategory(category: CategoryInput!): Category
    deleteCategory(id: ID!): Category

    "Currency Mutation"
    addCurrency(currency: CurrencyInput!): Currency
    deleteCurrency(id: ID!): Currency
  }

`;

module.exports = typeDefs;
