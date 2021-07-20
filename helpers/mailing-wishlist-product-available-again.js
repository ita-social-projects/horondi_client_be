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

module.exports = {
  mailingWishlistProductAvailableAgain,
};
