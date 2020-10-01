const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { currencyWorker } = require('./currency.worker');
const config = require('./app');

const server = new ApolloServer(config);

const PORT = process.env.PORT || 5000;

const app = express();
currencyWorker();

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(
    'apollo server started, port',
    PORT,
    `,Graphql path: ${server.graphqlPath}`
  );
});

module.exports = config;
