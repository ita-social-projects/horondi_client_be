const {
  ApolloServer,
  AuthenticationError,
  makeExecutableSchema,
} = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const verifyUser = require('./utils/verify-user');
const permissions = require('./permissions');
const logger = require('./logger');

connectDB();
require('dotenv').config();

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const { token } = req.headers || '';

    logger.log({
      level: 'info',
      message: `method: ${req.method}/baseUrl: ${req.baseUrl}/date:${
        req.fresh
      }/ request headers: ${JSON.stringify(req.headers)}/body: ${JSON.stringify(
        req.body
      )}`,
    });
    if (token) {
      const user = verifyUser(token);
      if (!user) throw new AuthenticationError('Invalid authorization token');
      logger.error({ level: 'error', message: 'Invalid authorization token' });
      return {
        user: await userService.getUserByFieldOrThrow('email', user.email),
      };
    }
  },
  introspection: true,
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/health', (req, res) => res.send('Health page!'));

server.applyMiddleware({ app });

app.listen(PORT, () => {
  logger.info(
    `apollo server started, port: ${PORT}, Graphql path: ${server.graphqlPath}`
  );
});
