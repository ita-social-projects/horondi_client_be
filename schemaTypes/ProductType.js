const { GraphQLObjectType, GraphQLNonNull, GraphQLID } = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});
module.exports = ProductType;
