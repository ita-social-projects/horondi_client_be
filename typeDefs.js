const { gql } = require('apollo-server');

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
    _id: ID!
    categoryCode: String!
    name: [Language!]
    images: ImageSet
    subcategories: [Subcategory!]
    available: Boolean!
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

  type Query {
    currencies: [Currency!]!
    categories: [Category!]!
    news: [News!]!
  }
`;

module.exports = typeDefs;
