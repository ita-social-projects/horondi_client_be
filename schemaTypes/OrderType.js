const { GraphQLObjectType } = require('graphql');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => {},
});
module.exports = OrderType;
