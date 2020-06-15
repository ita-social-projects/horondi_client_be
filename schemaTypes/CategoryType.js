const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
} = require('graphql');
const CategoryImageType = require('./CategoryImageType');
const CategoryNameType = require('./categoryNameType');

const CategoryType = new GraphQLObjectType({
  name: 'category',
  description: 'category schema',
  fields: () => ({
    id: { type: GraphQLInt },
    categoryCode: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLList(CategoryNameType) },
    images: { type: GraphQLList(CategoryImageType) },
    avaliable: { type: GraphQLBoolean },
  }),
});
module.exports = CategoryType;
