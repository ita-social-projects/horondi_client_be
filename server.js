const {
  ApolloServer,
  AuthenticationError,
  makeExecutableSchema,
} = require('apollo-server');
const { applyMiddleware } = require('graphql-middleware');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const verifyUser = require('./utils/verify-user');
const permissions = require('./permissions');

connectDB();
require('dotenv').config();

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions,
);

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const { token } = req.headers || '';
    if (token) {
      const user = verifyUser(token);
      if (!user) throw new AuthenticationError('Invalid authorization token');
      return {
        user: await userService.getUserByFieldOrThrow('email', user.email),
      };
    }
  },
  cors: { origin: '*' },
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('apollo server started, port', PORT));
