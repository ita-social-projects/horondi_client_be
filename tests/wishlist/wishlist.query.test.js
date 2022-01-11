const mongoose = require('mongoose');

const { setupApp } = require('../helper-functions');
const {
  WISHLIST_NOT_FOUND,
} = require('../../error-messages/wishlist.messages');
const {
  getWishlistByUserId,
  addProductToWishlist,
} = require('./wishlist.helper');

let operations;

describe('Wishlist queries tests', () => {
  beforeAll(async () => {
    operations = await setupApp();

    await addProductToWishlist('6173a57789fef228610bceba', operations);
  });

  it('should get wishlist by user id', async () => {
    const wishlist = await getWishlistByUserId(operations);

    expect(wishlist).toHaveProperty('user_id');
  });

  it('should receive message that wishlist is not found', async () => {
    await mongoose.connection.db.dropDatabase();

    const wishlist = await getWishlistByUserId(operations);

    expect(wishlist).toHaveProperty('message', WISHLIST_NOT_FOUND);
  });
});
