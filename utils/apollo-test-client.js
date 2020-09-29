const { IntrospectionFragmentMatcher } = require('apollo-cache-inmemory');
const { ApolloClient, InMemoryCache } = require('@apollo/client');
const { createHttpLink } = require('apollo-link-http');
const introspectionResult = require('../fragmentTypes.json');
const fetch = require('node-fetch');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.TEST_BASE_URI,
    fetch,
  }),
  cache: new InMemoryCache({
    addTypename: true,
    fragmentMatcher,
  }),
});

module.exports = client;
