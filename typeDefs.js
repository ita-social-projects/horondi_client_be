const { gql } = require('apollo-server');
const { newsType, newsInputType } = require('./modules/news/news.model');
const newsQuery = require('./modules/queries/query.model');
const { newsMutation } = require('./modules/mutations/news.model');

const typeDefs = gql`
  type Language {
    lang: String!
    value: String!
  }
  input LanguageInput {
    lang: String!
    value: String!
  }

  type ImageSet {
    large: String
    medium: String
    small: String
    thumbnail: String
  }
input ImageSetInput {
    large: String
    medium: String
    small: String
    thumbnail: String
  }

  type PrimaryImage {
    primary: ImageSet!
    additional: [ImageSet!]
  }
  input PrimaryImageInput {
    primary: ImageSetInput!
    additional: [ImageSetInput!]
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

  input AuthorInput {
    name: String!
    image: ImageSetInput
  }

  type News {
  ${newsType}
  }
input NewsInput {
${newsInputType}
}

  type Query {
    ${newsQuery}
  }
  type Mutation {
    ${newsMutation}
  }
`;

module.exports = typeDefs;
