const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const { jwtClient } = require('./client/jwt-client');
const permissions = require('./permissions');
const { INVALID_PERMISSIONS } = require('./error-messages/user.messages');
const errorOutputPlugin = require('./plugins/error-output.plugin');
const formatError = require('./utils/format-error');
const { currencyWorker } = require('./currency.worker');
const {
  checkCertificatesPaymentStatus,
  checkOrderPaymentStatus,
} = require('./modules/payment/payment.service');
const formatErrorForLogger = require('./utils/format-error-for-logger');
const { cronJob } = require('./helpers/cron-job');
const translationsService = require('./modules/translations/translations.service');
const {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  NODE_ENV,
  SECRET,
} = require('./dotenvValidator');

const logger = require('./logger');
const { initLogger: initLoggerHttp } = require('./loggerHttp');

const { registerAdmin } = require('./tests/helper-functions');
const RuleError = require('./errors/rule.error');

let loggerHttp = null;

(async () => {
  const dbConnection = await connectDB();
  currencyWorker(dbConnection.db);
  loggerHttp = initLoggerHttp(dbConnection.getClient());
})();

if (NODE_ENV === 'test') {
  registerAdmin(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
}

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      const { token } = req.headers || '';

      loggerHttp.log({
        level: 'info',
        message: JSON.stringify({
          method: req.method,
          baseUrl: req.baseUrl,
          date: req.fresh,
          ip: req.connection.remoteAddress,
        }),
      });

      if (token) {
        try {
          const { userId } = jwtClient.decodeToken(token, SECRET);

          if (!userId) {
            loggerHttp.error(formatErrorForLogger(INVALID_PERMISSIONS));
            return null;
          }
          return {
            user: await userService.getUserByFieldOrThrow('_id', userId),
          };
        } catch (e) {
          return new RuleError(e.message, e.statusCode);
        }
      }
    }
  },

  plugins: [errorOutputPlugin],
  formatError: formatError((err) => {
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
});

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://horondi-admin-staging.azurewebsites.net',
      'https://horondi-front-staging.azurewebsites.net',
      'https://horondi-front.azurewebsites.net',
      'https://54.76.178.89',
      'https://54.154.216.60',
      'https://23.105.225.142',
      'https://23.108.217.143',
    ],
  })
);
app.disable('x-powered-by');

currencyWorker();

app.post('/fondy/certificates_callback', checkCertificatesPaymentStatus);
app.post('/fondy/order_callback', checkOrderPaymentStatus);
app.get('/translations', translationsService.getAllTranslations);

server.applyMiddleware({
  app,
  bodyParserConfig: {
    limit: '15mb',
  },
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  cronJob();
  logger.log({
    level: 'notice',
    message: `Apollo server started, port ${PORT}, Graphql path: ${server.graphqlPath}`,
  });
});
