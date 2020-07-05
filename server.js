const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const verifyUser = require('./utils/verifyUser');

connectDB();
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const { token } = req.headers || '';
    if (token) {
      const user = verifyUser(token);
      return { user: await userService.getUserByFieldOrThrow('email', user.email) };
    }
  },
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('apollo server started, port', PORT));
