const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
const UserType = require('./schemaTypes/UserType');

const users = [
  {
    id: 1,
    firstName: 'Ival',
    lastName: 'Oval',
    role: 'user',
    email: 'bandvov@gmail.com',
  },
  {
    id: 2,
    firstName: 'Rex',
    lastName: 'Maq',
    role: 'admin',
    email: 'mass@gmail.com',
  },
];

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    role: {
      type: GraphQLList(GraphQLString),
      resolve: () => ['admin', 'user'],
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => users.find(user => user.id === args.id),
    },
  }),
});

module.exports = RootQuery;
