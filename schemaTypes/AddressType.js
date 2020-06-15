const { GraphQLObjectType, GraphQLString } = require('graphql');

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    street: {
      type: GraphQLString,
    },
  }),
});

module.exports = AddressType;
