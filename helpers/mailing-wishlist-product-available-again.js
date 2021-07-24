const _ = require('lodash');

const {
  getAllUsersByWishlistProduct,
} = require('../modules/wishlist/wishlist.service');
const { sendEmail } = require('../modules/email/email.service');
const { IMAGE_LINK } = require('../dotenvValidator');
const {
  EmailActions: { PRODUCT_AVAILABLE_AGAIN_WISHLIST },
} = require('../consts/email-actions');

const mailingWishlistProductAvailableAgain = async usersList => {
  await Promise.all(
    usersList.map(async user => {
      await sendEmail(user.email, PRODUCT_AVAILABLE_AGAIN_WISHLIST, {
        wishlistItem: user.wishlist.items[0],
        imageUrl: IMAGE_LINK,
        firstName: user.firstName,
      });
    })
  );
};

const sendEmailsIfProductAvailableAgain = async (
  beforeChanges,
  afterChanges,
  id
) => {
  if (
    _.find(beforeChanges, el => el.available === false) &&
    _.find(afterChanges, el => el.available === true)
  ) {
    const usersList = await getAllUsersByWishlistProduct(id);
    if (usersList.length) {
      await mailingWishlistProductAvailableAgain(usersList);
    }
  }
};

module.exports = {
  sendEmailsIfProductAvailableAgain,
};
