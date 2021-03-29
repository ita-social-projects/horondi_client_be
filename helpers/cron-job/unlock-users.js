const { schedule } = require('node-cron');

const UserModel = require('../../modules/user/user.model');
const { getDaysInMilliseconds } = require('../../utils/getDaysInMilliseconds');
const { sendEmail } = require('../../modules/email/email.service');
const {
  EmailActions: { UNLOCK_USER },
} = require('../../consts/email-actions');
const {
  USER_BLOCK_COUNT: {},
  USER_BLOCK_PERIOD: { UNLOCKED, INFINITE },
} = require('../../consts/user-block-period');

const unlockUsers = () =>
  schedule('0 0 */12 * * *', async () => {
    const currentDate = new Date().getTime();

    const blockedUsers = await UserModel.find({
      $and: [
        { 'banned.blockPeriod': { $ne: UNLOCKED } },
        { 'banned.blockPeriod': { $ne: INFINITE } },
      ],
    });

    if (blockedUsers.length) {
      for (const userData of blockedUsers) {
        const blockDate = new Date(userData.banned.updatedAt).getTime();
        const dateDifference = currentDate - blockDate;
        const blockPeriod = getDaysInMilliseconds(
          Number(userData.banned.blockPeriod)
        );

        if (dateDifference >= blockPeriod) {
          await UserModel.findOneAndUpdate(
            { _id: userData._id },
            {
              $set: {
                banned: {
                  blockPeriod: UNLOCKED,
                  blockCount: userData.banned.blockCount,
                },
              },
            }
          );

          return sendEmail(userData.email, UNLOCK_USER);
        }
      }
    }
  });

module.exports = {
  unlockUsers,
};
