const { schedule } = require('node-cron');

const UserModel = require('../../modules/user/user.model');
const { getDaysInMilliseconds } = require('../../utils/getDaysInMilliseconds');
const { sendEmail } = require('../../modules/email/email.service');
const { addHistoryRecord } = require('../../modules/history/history.service');
const {
  EmailActions: { UNLOCK_USER },
} = require('../../consts/email-actions');
const {
  USER_BLOCK_PERIOD: { UNLOCKED, INFINITE },
} = require('../../consts/user-block-period');
const {
  CRON_PERIOD: { EVERY_TWELVE_HOURS },
} = require('../../consts/cron-period');
const {
  HISTORY_ACTIONS: { UNLOCK_USER: UNLOCK_ACTION },
} = require('../../consts/history-actions');
const { getChanges, generateHistoryObject } = require('../../utils/history');

const unlockUsers = () => schedule(EVERY_TWELVE_HOURS, async () => {
  const currentDate = new Date().getTime();

  const blockedUsers = await UserModel.find({
    $and: [
      { 'banned.blockPeriod': { $ne: UNLOCKED } },
      { 'banned.blockPeriod': { $ne: INFINITE } },
    ],
  }).exec();

  if (blockedUsers.length) {
    for (const userData of blockedUsers) {
      const blockDate = new Date(userData.banned.updatedAt).getTime();
      const dateDifference = currentDate - blockDate;
      const blockPeriod = getDaysInMilliseconds(
        Number(userData.banned.blockPeriod),
      );

      if (dateDifference >= blockPeriod) {
        const unlockedUser = await UserModel.findOneAndUpdate(
          { _id: userData._id },
          {
            $set: {
              banned: {
                blockPeriod: UNLOCKED,
                blockCount: userData.banned.blockCount,
              },
            },
          },
        ).exec();
        const { beforeChanges, afterChanges } = getChanges(
          userData,
          unlockedUser,
        );
        const historyRecord = generateHistoryObject(
          UNLOCK_ACTION,
          '',
          `${userData.firstName} ${userData.lastName}`,
          userData._id,
          beforeChanges,
          afterChanges,
        );
        await addHistoryRecord(historyRecord);
        return sendEmail(userData.email, UNLOCK_USER);
      }
    }
  }
});

module.exports = {
  unlockUsers,
};
