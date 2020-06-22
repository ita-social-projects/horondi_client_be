const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');

connectDB();
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('apollo server started, port', PORT));
