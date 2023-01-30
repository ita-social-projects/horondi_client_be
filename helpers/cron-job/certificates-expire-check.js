const { schedule } = require('node-cron');

const {
  CertificateModel,
} = require('../../modules/certificate/certificate.model');
const userModel = require('../../modules/user/user.model');

const { modifyDate } = require('../../utils/modify-date');
const { sendEmail } = require('../../modules/email/email.service');

const {
  EmailActions: { CERTIFICATE_REMINDER },
} = require('../../consts/email-actions');

const {
  CRON_PERIOD: { EVERY_MORNING },
} = require('../../consts/cron-period');

const currentDate = modifyDate({});
const nowPlus30 = modifyDate({ days: 30 });
const nowPlus31 = modifyDate({ days: 31 });
const certificateFilter = {
  isUsed: false,
  isExpired: false,
  isActivated: true,
  email: { $ne: null },
};

const certificatesExpireCheck = () =>
  schedule(EVERY_MORNING, async () => {
    const expiredFilter = {
      ...certificateFilter,
      dateEnd: {
        $lte: currentDate,
      },
    };

    await CertificateModel.updateMany(expiredFilter, {
      isExpired: true,
      isActivated: false,
    }).exec();

    const reminderFilter = {
      ...certificateFilter,
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
        const user = await userModel
          .findOne({ email: certificate.email })
          .exec();
        const language = user.configs.language === 'ua' ? 0 : 1;

        await sendEmail(certificate.email, CERTIFICATE_REMINDER, {
          item: certificate,
          language,
          dateEnd,
        });
      }
    }

    const allUsers = await userModel.find().exec();

    allUsers.forEach(async user => {
      const userCertificates = await CertificateModel.find({
        ...certificateFilter,
        email: user.email,
      }).exec();

      const expiringCertificates = userCertificates.filter(
        certificate => certificate.dateEnd < nowPlus31
      );

      const expireDate = expiringCertificates.length
        ? expiringCertificates[0].dateEnd
        : null;

      user.certificateExpires = expireDate;

      user.save();
    });
  });

module.exports = {
  certificatesExpireCheck,
};
