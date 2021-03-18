const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const verifyUser = require('./utils/verify-user');
const permissions = require('./permissions');
const logger = require('./logger');
const loggerHttp = require('./loggerHttp');
const { INVALID_PERMISSIONS } = require('./error-messages/user.messages');
const errorOutputPlugin = require('./plugins/error-output.plugin');
const formatError = require('./utils/format-error');
const { currencyWorker } = require('./currency.worker');
const formatErrorForLogger = require('./utils/format-error-for-logger');
const { dotenvVariables } = require('./dotenvValidator');
const { cronJob } = require('./helpers/cron-job');
const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  NODE_ENV,
} = require('./dotenvValidator');
const { registerAdmin } = require('./tests/helper-functions');

connectDB();

if (NODE_ENV === 'test') {
  registerAdmin(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
}

dotenvVariables.forEach(key => {
  logger.log('info', JSON.stringify({ key, value: process.env[key] }));
});

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const { token } = req.headers || '';

    loggerHttp.log({
      level: 'info',
      message: `method: ${req.method}/baseUrl: ${req.baseUrl}/date:${req.fresh}/`,
    });
    if (token) {
      const user = verifyUser(token);

      if (!user) {
        logger.error({
          level: 'error',
          message: formatErrorForLogger(INVALID_PERMISSIONS),
        });
        return null;
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
});

const PORT = process.env.PORT || 5000;

const app = express();
app.disable('x-powered-by');
currencyWorker();

server.applyMiddleware({
  app,
  bodyParserConfig: {
    limit: '15mb',
  },
});

app.listen(PORT, () => {
  cronJob();
  console.log(
    'apollo server started, port',
    PORT,
    `,Graphql path: ${server.graphqlPath}`
  );
});
