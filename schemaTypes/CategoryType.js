const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
} = require('graphql');
const CategoryImageType = require('./CategoryImageType');
const CategoryNameType = require('./categoryNameType');

const CategoryType = new GraphQLObjectType({
  name: 'category',
  description: 'category schema',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    categoryCode: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLList(CategoryNameType) },
    images: { type: CategoryImageType },
    available: { type: GraphQLBoolean },
  }),
});
module.exports = CategoryType;
