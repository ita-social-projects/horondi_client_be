const { IntrospectionFragmentMatcher } = require('apollo-cache-inmemory');
const { ApolloClient, InMemoryCache } = require('@apollo/client');
const { createHttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const introspectionResult = require('../fragmentTypes.json');
const { TEST_BASE_URI } = require('../dotenvValidator');

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: TEST_BASE_URI,
    fetch,
  }),
  cache: new InMemoryCache({
    addTypename: true,
    fragmentMatcher,
  }),
});

module.exports = client;
