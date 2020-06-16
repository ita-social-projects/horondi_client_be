const { GraphQLObjectType, GraphQLList } = require('graphql');
const CategoryType = require('./schemaTypes/CategoryType');
const Category = require('./models/Category');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    categories: {
      type: GraphQLList(CategoryType),
      resolve: () => {
        const x = Category.find().exec();

        return x;
      },
    },
  }),
});

module.exports = RootQuery;
