const { IntrospectionFragmentMatcher } = require('apollo-cache-inmemory');
const { ApolloClient, InMemoryCache } = require('@apollo/client');
require('dotenv').config();
const { createHttpLink } = require('apollo-link-http');
const introspectionResult = require('../fragmentTypes.json');
const fetch = require('node-fetch');

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
