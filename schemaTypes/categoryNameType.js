const { GraphQLObjectType, GraphQLString } = require('graphql');

const CategoryNameType = new GraphQLObjectType({
  name: 'name',
  description: 'category name',
  fields: () => ({
    lang: {
      type: GraphQLString,
      value: GraphQLString,
    },
  }),
});

module.exports = CategoryNameType;
