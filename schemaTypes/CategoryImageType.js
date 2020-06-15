const { GraphQLObjectType, GraphQLString } = require('graphql');

const CategoryImageType = new GraphQLObjectType({
  name: 'image',
  description: ' category image',
  fields: () => ({
    large: {
      type: GraphQLString,
      value: GraphQLString,
    },
    medium: {
      type: GraphQLString,
      value: GraphQLString,
    },
    small: {
      type: GraphQLString,
      value: GraphQLString,
    },
    thumbnail: {
      type: GraphQLString,
      value: GraphQLString,
    },
  }),
});

module.exports = CategoryImageType;
