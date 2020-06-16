const { GraphQLObjectType, GraphQLList, GraphQLID } = require('graphql');
const CategoryType = require('./schemaTypes/CategoryType');
const Category = require('./models/Category');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    categories: {
      type: GraphQLList(CategoryType),
      resolve: () => Category.find(),
    },

    category: {
      type: CategoryType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (parent, args) => Category.findById(args.id),
    },
  }),
});
module.exports = RootQuery;
