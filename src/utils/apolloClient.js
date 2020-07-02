require('dotenv').config();

const { ApolloClient, gql } = require('apollo-boost');
const {
  InMemoryCache,
  NormalizedCacheObject,
} = require('apollo-cache-inmemory');

const client = new ApolloClient({
  cache: InMemoryCache,
  link: process.env.BASE_URI,
});

const apolloClient = query => {
  client.query({
    query: gql`
      ${query}
    `,
  });
};

module.exports = { apolloClient };
