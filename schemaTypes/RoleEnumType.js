const { GraphQLEnumType, GraphQLString } = require('graphql');

const RoleEnumType = new GraphQLEnumType({
  name: 'roleenum',
  values: {
    admin: {
      type: GraphQLString,
      value: 'admin',
    },
    user: {
      type: GraphQLString,
      value: 'user',
    },
  },
});
module.exports = RoleEnumType;
