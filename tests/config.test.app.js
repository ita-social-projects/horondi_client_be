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
const LoggerHttp = require('../loggerHttp');
const { currencyWorker } = require('../currency.worker');

let loggerHttp;

(async () => {
  const dbConnection = await connectDB();
  currencyWorker(dbConnection.db);
  loggerHttp = LoggerHttp(dbConnection.getClient());
})();

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
  formatError: formatError(err => {
    loggerHttp.error(
      JSON.stringify({
        key: err.extensions.code,
        value: err.message,
      }),
      {
        metadata: err.extensions.exception
          ? err.extensions.exception.stacktrace
          : [],
      }
    );
  }),
  introspection: true,
  cors: { origin: '*' },
};

module.exports = config;
