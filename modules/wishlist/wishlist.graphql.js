const wishlistType = `
  type Wishlist {
    _id: ID
    user_id: ID
    products: [Product]
  }
`;

module.exports = {
  wishlistType,
};
