const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLEnumType,
} = require('graphql');
const AddressType = require('./AddressType');
// const OrderType = require('./OrderType');
// const ProductType = require('./ProductType');
// const CommentType = require('./CommentType');
const RoleEnumType = require('./RoleEnumType');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: GraphQLID,
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLNonNull(GraphQLString),
    },
    role: {
      type: RoleEnumType,
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    phoneNumber: {
      type: GraphQLNonNull(GraphQLInt),
    },
    address: {
      type: AddressType,
    },
    // credentials: {
    //   source: {
    //     type: GraphQLNonNull(GraphQLString),
    //   },
    //   default: {
    //     type: GraphQLNonNull(GraphQLInt),
    //   },
    // },
    // registrationDate: {
    //   type: GraphQLNonNull(GraphQLInt),
    // },
    // wishlist: {
    //   type: GraphQLList(ProductType),
    // },
    // cart: {
    //   type: GraphQLList(ProductType),
    // },
    // orders: {
    //   type: GraphQLList(OrderType),
    // },
    // purchasedProducts: {
    //   type: GraphQLList(ProductType),
    // },
    // comments: {
    //   type: GraphQLList(CommentType),
    // },
  }),
});
module.exports = UserType;
