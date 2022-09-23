const { schedule } = require('node-cron');

const {
  CertificateModel,
} = require('../../modules/certificate/certificate.model');

const { modifyDate } = require('../../utils/modify-date');
const { sendEmail } = require('../../modules/email/email.service');

const {
  EmailActions: { CERTIFICATE_REMINDER },
} = require('../../consts/email-actions');

const {
  CRON_PERIOD: { EVERY_MORNING },
} = require('../../consts/cron-period');

const currentDate = modifyDate({});
const tomorrow = modifyDate({ days: 1 });
const nowPlus30 = modifyDate({ days: 30 });
const nowPlus31 = modifyDate({ days: 31 });

const certificatesExpireCheck = () =>
  schedule(EVERY_MORNING, async () => {
    const activateFilter = {
      isActivated: false,
      dateStart: {
        $gte: currentDate,
        $lt: tomorrow,
      },
    };

    await CertificateModel.updateMany(activateFilter, {
      isActivated: true,
    }).exec();

    const expiredFilter = {
      isUsed: false,
      isExpired: false,
      dateEnd: {
        $lte: currentDate,
      },
    };

    await CertificateModel.updateMany(expiredFilter, {
      isExpired: true,
      isActivated: false
    }).exec();

    const reminderFilter = {
      isUsed: false,
      isExpired: false,
      email: { $ne: null },
      dateEnd: {
        $gte: nowPlus30,
        $lt: nowPlus31,
      },
    };

    const certificatesRemind = await CertificateModel.find(
      reminderFilter
    ).exec();

    if (certificatesRemind.length) {
      for (const certificate of certificatesRemind) {
        const dateEnd = new Date(certificate.dateEnd).toLocaleDateString(
          'uk-UA'
        );
        await sendEmail(certificate.email, CERTIFICATE_REMINDER, {
          dateEnd: dateEnd,
        });
      }
    }
  });

module.exports = {
  certificatesExpireCheck,
};
