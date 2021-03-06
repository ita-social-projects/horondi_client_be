const { makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const connectDB = require('../config/db');
const typeDefs = require('../typeDefs');
const resolvers = require('../resolvers');
const permissions = require('../permissions');
const errorOutputPlugin = require('../plugins/error-output.plugin');
const formatError = require('../utils/format-error');
const verifyUser = require('../utils/verify-user');
const userService = require('../modules/user/user.service');
const { INVALID_PERMISSIONS } = require('../error-messages/user.messages');

connectDB();

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

const config = {
  schema,
  context: async ({ req }) => {
    const { token } = req.headers || '';
    if (token) {
      const user = verifyUser(token);
      if (!user) {
        return {
          statusCode: 401,
          message: INVALID_PERMISSIONS,
        };
      }

      return {
        user: await userService.getUserByFieldOrThrow('email', user.email),
      };
    }
  },
  plugins: [errorOutputPlugin],
  formatError,
  introspection: true,
  cors: { origin: '*' },
};

module.exports = config;
