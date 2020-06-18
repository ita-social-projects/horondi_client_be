const { gql } = require('apollo-server');
const category = require('./modules/categories/categories.model');
const material = require('./modules/materials/materials.model');
const pattern = require('./modules/patterns/patterns.model')

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
    _id: ID!
    date: String!
    convertOptions: [ConvertOption!]
  }

  type Subcategory {
    _id: ID!
    categoryCode: String!
    name: [Language!]
    images: ImageSet
    available: Boolean!
  }

  type Category {
    ${category}
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
    ${material}
  }

  type Pattern {
    ${pattern}
  }

  type Query {
    currencies: [Currency!]!
    currency(id: ID): Currency

    getAllCategories: [Category!]!
    getCategoryById(id: ID): Category

    allNews: [News!]!
    oneNews(id: ID): News

    getAllMaterials: [Material!]!
    getMaterialById(id: ID): Material

    getAllPatterns: [Pattern!]!
    getPatternById(id: ID): Pattern
  }
`;

module.exports = typeDefs;
