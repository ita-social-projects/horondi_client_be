const { gql } = require('apollo-server');
const { newsType, newsInput } = require('./modules/news/news.graphql');
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

  ${categoryType}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternsType}

  type Subcategory {
    _id: ID!
    categoryCode: String!
    name: [Language!]
    images: ImageSet
    available: Boolean!
  }

  type Author {
    name: [Language]
    image: ImageSet
  }

  type Color {
    code: Int!
    name: [Language!]
    images: ImageSet
    available: Boolean!
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

  input LanguageInput {
    lang: String!
    value: String!
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
  }
`;

module.exports = typeDefs;
