const { schedule } = require('node-cron');

const UserModel = require('../../modules/user/user.model');
const { getDaysInMilliseconds } = require('../../utils/getDaysInMilliseconds');
const { sendEmail } = require('../../modules/email/email.service');
const { IMAGE_LINK } = require('../../dotenvValidator');
const {
  EmailActions: { INCOMPLETE_OPERATIONS_CART },
} = require('../../consts/email-actions');
const {
  CRON_PERIOD: { EVERY_TWELVE_HOURS },
} = require('../../consts/cron-period');

const rememberAboutUnfinishedCartOperations = () => schedule(EVERY_TWELVE_HOURS, async () => {
  const currentDate = new Date().getTime();

  const usersInfo = await UserModel.find(
    { cart: { $exists: true } },
    'cart email',
  )
    .populate({
      path: 'cart.items.product',
      select: 'name images ',
    })
    .populate({
      path: 'cart.items.fromConstructor.product',
      select: 'name images ',
    })
    .populate({
      path: 'cart.items.options.size ',
      select: 'name',
    })
    .exec();

  if (usersInfo.length) {
    await Promise.all(
      usersInfo.map(async (cartItemData) => {
        if (cartItemData.cart?.items?.length) {
          const orderDate = new Date(cartItemData.cart.updatedAt).getTime();
          const dateDifference = currentDate - orderDate;
          const oneDay = getDaysInMilliseconds();

          if (
            dateDifference >= oneDay
              && !cartItemData.cart.rememberMailCount
          ) {
            await sendEmail(cartItemData.email, INCOMPLETE_OPERATIONS_CART, {
              items: cartItemData.cart.items,
              totalPrice: cartItemData.cart.totalPrice,
              imagesUrl: IMAGE_LINK,
            });
            return UserModel.findOneAndUpdate(
              { _id: cartItemData._id },
              { $set: { 'cart.rememberMailCount': 1 } },
            );
          }
        }
      }),
    );
  }
});

module.exports = {
  rememberAboutUnfinishedCartOperations,
};
