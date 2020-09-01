const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
const userService = require('./modules/user/user.service');
const verifyUser = require('./utils/verify-user');
const express = require('express')

connectDB();
require('dotenv').config();


const server = new ApolloServer({
  typeDefs,
  resolvers,
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
  introspection: true,
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/health', (req, res) => 
  res.send('Health page!')
);

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log('apollo server started, port', PORT);
});
