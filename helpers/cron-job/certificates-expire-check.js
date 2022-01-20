const { schedule } = require('node-cron');

const CertificateModel = require('../../modules/certificate/certificate.model');
const { modifyNowDate, _ } = require('../../utils/modify-date');
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
const datePastYears = modifyNowDate(_, _, -2);

const certificatesExpireCheck = () =>
  schedule(EVERY_MORNING, async () => {
    const deleteFilter = {
      dateEnd: {
        $lte: datePastYears,
      },
    };

    await CertificateModel.deleteMany(deleteFilter).exec();

    const expiredFilter = {
      isUsed: false,
      isActive: true,
      dateEnd: {
        $lte: currentDate,
      },
    };

    await CertificateModel.updateMany(expiredFilter, {
      isActive: false,
    }).exec();

    const reminderFilter = {
      isUsed: false,
      isActive: true,
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
