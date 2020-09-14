const { ApolloServer, AuthenticationError, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const express = require('express')
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
  plugins: [
    {
      requestDidStart(){
        return {
          willSendResponse(context){
            if (context.errors) {
              console.log(context.response.http)
              context.response.data = {
                [context.errors[0].path]: context.response.errors[0]
              }
              delete context.response.errors
            }
          }
        }
      }
    }
  ],
  formatError: (err) => {
    const {originalError} = err;

    if(originalError.name === 'RuleError') {
      return {
        message: originalError.message,
        statusCode: originalError.statusCode
      }
    }

    return err;
  },
  introspection: true,
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/health', (req, res) => res.send('Health page!'));

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log('apollo server started, port', PORT, `,Graphql path: ${server.graphqlPath}`);
});
