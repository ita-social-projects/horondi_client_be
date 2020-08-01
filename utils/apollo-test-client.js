const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloClient } = require('apollo-boost');
require('dotenv').config();

const fetch = require('node-fetch');

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.TEST_BASE_URI ,
    fetch,
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

module.exports = client;
