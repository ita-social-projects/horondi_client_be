const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');
const Category = require('./models/Category');
const CategoryType = require('./schemaTypes/CategoryType');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    role: {
      type: GraphQLList(GraphQLString),
      resolve: () => ['admin', 'user'],
    },
    categories: {
      type: GraphQLList(CategoryType),
      resolve: () => {
        const a = Category.find({ avaliable: true });
        return {
          id: a._id,
        };
      },
    },
    test: {
      type: GraphQLString,
      resolve: () => 'test string',
    },
  }),
});

module.exports = RootQuery;
