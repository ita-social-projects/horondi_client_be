const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
} = require('graphql');
const CategoryImageType = require('./CategoryImageType');
const CategoryNameType = require('./categoryNameType');

const CategoryType = new GraphQLObjectType({
  name: 'category',
  description: 'category schema',
  fields: () => ({
    categoryCode: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLList(CategoryNameType) },
    images: { type: GraphQLList(CategoryImageType) },
    available: { type: GraphQLBoolean },
  }),
});
module.exports = CategoryType;
