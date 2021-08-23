const { makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const connectDB = require('../config/db');
const typeDefs = require('../typeDefs');
const resolvers = require('../resolvers');
const permissions = require('../permissions');
const errorOutputPlugin = require('../plugins/error-output.plugin');
const formatError = require('../utils/format-error');
const JWTClient = require('../utils/jwt-client');
const userService = require('../modules/user/user.service');
const { INVALID_PERMISSIONS } = require('../error-messages/user.messages');
const { initLogger: initLoggerHttp } = require('../loggerHttp');
const { currencyWorker } = require('../currency.worker');
const { NODE_ENV, SECRET } = require('../dotenvValidator');

let loggerHttp;

(async () => {
  if (NODE_ENV !== 'test') return;

  const dbConnection = await connectDB();
  currencyWorker(dbConnection.db);
  loggerHttp = initLoggerHttp(dbConnection.getClient());
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
      const user = JWTClient.decodeToken(token, SECRET);
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
