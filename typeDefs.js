const { gql } = require('apollo-server');
const { newsType } = require('./modules/news/news.model');
const queryType = require('./modules/query/query.model');

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

  type Author {
    name: String!
    image: ImageSet
  }

  type News {
  ${newsType}
  }

  type Query {
   ${queryType}
  }
`;

module.exports = typeDefs;
