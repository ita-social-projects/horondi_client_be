const { schedule } = require('node-cron');

const CertificateModel = require('../../modules/certificate/certificate.model');
const { modifyNowDate } = require('../../utils/modify-date');
const { sendEmail } = require('../../modules/email/email.service');
const {
  EmailActions: { CERTIFICATE_REMINDER },
} = require('../../consts/email-actions');
const {
  CRON_PERIOD: { EVERY_MORNING },
} = require('../../consts/cron-period');

const currentDate = new Date();
const nowPlus30 = modifyNowDate(30);
const nowPlus31 = modifyNowDate(31);
const tomorrow = modifyNowDate(1);

const certificatesExpireCheck = () =>
  schedule(EVERY_MORNING, async () => {
    const activateFilter = {
      isActivated: false,
      dateStart: {
        $gte: currentDate,
        $lte: tomorrow,
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
    }).exec();

    const reminderFilter = {
      isUsed: false,
      isExpired: false,
      email: { $ne: null },
      dateEnd: {
        $gte: nowPlus30,
        $lte: nowPlus31,
      },
    };

    const certificatesRemind = await CertificateModel.find(
      reminderFilter
    ).exec();

    if (certificatesRemind.length) {
      for (const certificate of certificatesRemind) {
        await sendEmail(certificate.email, CERTIFICATE_REMINDER);
      }
    }
  });

module.exports = {
  certificatesExpireCheck,
};
