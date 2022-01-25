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
  HISTORY_ACTIONS: { UNLOCK_EVENT },
  HISTORY_NAMES: { USER_EVENT },
} = require('../../consts/history-events');
const { getChanges, generateHistoryObject } = require('../../utils/history');

const unlockUsers = () =>
  schedule(EVERY_TWELVE_HOURS, async () => {
    const currentDate = new Date().getTime();

    const blockedUsers = await UserModel.find({
      $and: [
        { 'banned.blockPeriod': { $ne: UNLOCKED } },
        { 'banned.blockPeriod': { $ne: INFINITE } },
      ],
    }).exec();

    if (blockedUsers.length) {
      Promise.all(
        blockedUsers.map(async userData => {
          const blockDate = new Date(userData.banned.updatedAt).getTime();
          const dateDifference = currentDate - blockDate;
          const blockPeriod = getDaysInMilliseconds(
            Number(userData.banned.blockPeriod)
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
              }
            ).exec();
            const { beforeChanges, afterChanges } = getChanges(
              userData,
              unlockedUser
            );
            const historyEvent = {
              action: UNLOCK_EVENT,
              historyName: USER_EVENT,
            };
            const historyRecord = generateHistoryObject(
              historyEvent,
              '',
              `${userData.firstName} ${userData.lastName}`,
              userData._id,
              beforeChanges,
              afterChanges
            );
            await addHistoryRecord(historyRecord);
            await sendEmail(userData.email, UNLOCK_USER);
          }
        })
      );
    }
  });

module.exports = {
  unlockUsers,
};
