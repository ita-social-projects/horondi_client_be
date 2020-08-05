const { createHttpLink } = require('apollo-link-http');
const {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} = require('apollo-cache-inmemory');
const { ApolloClient } = require('apollo-boost');
require('dotenv').config();

const fetch = require('node-fetch');
const introspectionResult = require('../fragmentTypes.json');

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.TEST_BASE_URI,
    fetch,
  }),
  cache: new InMemoryCache({
    addTypename: false,
    fragmentMatcher,
  }),
});

module.exports = client;
