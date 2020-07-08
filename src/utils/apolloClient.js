const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloClient } = require('apollo-boost');
require('dotenv').config();

const fetch = require('node-fetch');

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.BASE_URI,
    fetch,
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  request: operation => {
    operation.setContext({
      headers: {
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZjYWY3MWU2MWYwYjQ3MDA4NzA2MTIiLCJlbWFpbCI6InRhY2prYTM0QGdtYWlsLmNvbSIsImlhdCI6MTU5NDIxOTMxNSwiZXhwIjoxNTk0MjIyOTE1fQ.f2RbXNM0HN7sgjrDwcUgN5edT2m6QV5590EnyKPKbic`
      }
    });
  }
});

module.exports = client;
