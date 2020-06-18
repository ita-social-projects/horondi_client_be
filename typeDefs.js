const { gql } = require('apollo-server');

const typeDefs = gql`
  type Language {
    _id: ID
    lang: String
    value: String
  }

  type ImageSet {
    _id: ID
    large: String
    medium: String
    small: String
    thumbnail: String
  }

  type PrimaryImage {
    _id: ID
    primary: ImageSet
    additional: [ImageSet]
  }

  type ConvertOption {
    name: String
    exchangeRate: Int
  }

  type Currency {
    _id: ID
    date: String
    convertOptions: [ConvertOption]
  }

  type Query {
    currency: [Currency]
    language: [Language]
  }
`;
module.exports = typeDefs;
