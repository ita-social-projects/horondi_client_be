const { GraphQLObjectType, GraphQLNonNull, GraphQLID } = require('graphql');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});
module.exports = OrderType;
