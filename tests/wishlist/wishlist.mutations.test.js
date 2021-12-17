const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const {
  WISHLIST_NOT_FOUND,
} = require('../../error-messages/wishlist.messages');
const {
  addProductToWishlist,
  deleteProductFromWishlist,
} = require('./wishlist.helper');

let operations;
const productId = '6173a57789fef228610bceba';

describe('Wishlist mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add product to wishlist', async () => {
    await addProductToWishlist(productId, operations);
    const wishlist = await addProductToWishlist(
      '5123a57789fef228620bceba',
      operations,
    );

    expect(wishlist).toHaveProperty('user_id');
  });

  test('should delete item that item already exists', async () => {
    const wishlist = await addProductToWishlist(productId, operations);

    expect(wishlist).toHaveProperty('user_id');
  });

  it('should delete product from wishlist', async () => {
    const wishlist = await deleteProductFromWishlist(productId, operations);

    expect(wishlist.products.length).toBe(1);
  });

  it('should receive message that wishlist is not found', async () => {
    await mongoose.connection.db.dropDatabase();

    const wishlist = await deleteProductFromWishlist(productId, operations);

    expect(wishlist).toHaveProperty('message', WISHLIST_NOT_FOUND);
  });
});
