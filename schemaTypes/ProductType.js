const { GraphQLObjectType } = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
});
module.exports = ProductType;
