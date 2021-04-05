const { schedule } = require('node-cron');

const UserModel = require('../../modules/user/user.model');
const { getDaysInMilliseconds } = require('../../utils/getDaysInMilliseconds');

const { sendEmail } = require('../../modules/email/email.service');

const rememberAboutUnfinishedCartOperations = () =>
  schedule('*/10 * * * * *', async () => {
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
        // console.log(cartItemData)

        if (cartItemData.cart.items.length) {
          const orderDate = new Date(cartItemData.cart.updatedAt).getTime();
          const dateDifference = currentDate - orderDate;
          const oneDay = getDaysInMilliseconds();

          if (dateDifference > 1) {
            console.log(cartItemData);
            sendEmail(
              'anastasiyakolodyazhnaya13@gmail.com',
              'INCOMPLETE_OPERATIONS_CART',
              {
                items: cartItemData.cart.items,
                totalPrice: cartItemData.cart.totalPrice,
              }
            );

            await UserModel.findOneAndUpdate(
              { _id: cartItemData._id },
              { $set: { 'cart.rememberMailCount': 1 } }
            );
          }
        }
      }
    }
  });

module.exports = {
  rememberAboutUnfinishedCartOperations,
};
