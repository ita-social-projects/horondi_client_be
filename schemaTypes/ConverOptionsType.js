const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const ConvertOptionsType = new GraphQLObjectType({
  name: 'convertOptions',
  fields: () => ({
    name: GraphQLString,
    excangeRate: GraphQLInt,
  }),
});
module.exports = ConvertOptionsType;
