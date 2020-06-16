const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');
const CategoryType = require('./schemaTypes/CategoryType');
const Category = require('./models/Category');

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
        const x = Category.find()
          .exec()
          .then((res) => res);
        return x;
      },
    },
  }),
});

module.exports = RootQuery;
