const { schedule } = require('node-cron');

const {
  CRON_PERIOD_FOR_SEND_MSG_ABOUT_UNFINISHED_CART,
} = require('../../dotenvValidator');
const UserModel = require('../../modules/user/user.model');

const rememberAboutUnfinishedCartOperations = () =>
  schedule('*/5 * * * * *', async () => {
    const currentDate = new Date().getTime();

    const usersInfo = await UserModel.find(
      { cart: { $exists: true } },
      'cart email'
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
      usersInfo.forEach(cartItemData => {
        const orderDate = new Date(cartItemData.cart.updatedAt).getTime();
        const dateDifference = currentDate - orderDate;

        console.log(diff);
      });
    }
  });

module.exports = {
  rememberAboutUnfinishedCartOperations,
};
