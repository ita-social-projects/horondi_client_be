const { schedule } = require('node-cron');

const UserModel = require('../../modules/user/user.model');
const { getDaysInMilliseconds } = require('../../utils/getDaysInMilliseconds');

const rememberAboutUnfinishedCartOperations = () =>
  schedule('0 0 */12 * * *', async () => {
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
      for (const cartItemData of usersInfo) {
        const orderDate = new Date(cartItemData.cart.updatedAt).getTime();
        const dateDifference = currentDate - orderDate;
        const oneDay = getDaysInMilliseconds();

        if (dateDifference > oneDay && !cartItemData.cart.rememberMailCount) {
          await UserModel.findOneAndUpdate(
            { _id: cartItemData._id },
            { $set: { 'cart.rememberMailCount': 1 } }
          );
        }
      }
    }
  });

module.exports = {
  rememberAboutUnfinishedCartOperations,
};
