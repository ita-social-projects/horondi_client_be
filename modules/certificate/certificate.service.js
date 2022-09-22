const { randomInt } = require('crypto');
const RuleError = require('../../errors/rule.error');
const mongoose = require('mongoose');
const { CertificateModel } = require('./certificate.model');
const { sendEmail } = require('../../modules/email/email.service');
const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  EmailActions: { RECEIVE_GIFT_SERTIFICATE, SEND_GIFT_CERTIFICATE },
} = require('../../consts/email-actions');

const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  CERTIFICATE_HAVE_OWNER,
  CERTIFICATE_IS_ACTIVE,
  CERTIFICATE_IS_EXPIRED,
  CERTIFICATE_IS_NOT_ACTIVATED,
  CERTIFICATE_IS_USED,
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');

const { FONDY_PAYMENT_MULTIPLIER } = require('../../consts/payments');
const { modifyDate } = require('../../utils/modify-date');
const FilterHelper = require('../../helpers/filter-helper');

const generateName = async () => {
  const firstNamePart = Math.floor(randomInt(1000, 9999));
  const secondNamePart = Math.floor(randomInt(1000, 9999));
  const name = `HOR${firstNamePart}${secondNamePart}`;
  const candidate = await CertificateModel.findOne({ name }).exec();

  if (candidate) {
    return generateName();
  }

  return name;
};

class CertificatesService extends FilterHelper {
  async getAllCertificates(skip, limit, sortBy, sortOrder, search, status) {
    const filter = {
      $and: [
        { $or: [{ paymentStatus: 'PAID' }, { createdBy: { $ne: null } }] },
      ],
    };

    this.filterByName(filter, search);
    if (status.length) {
      if (!filter['$or']) {
        filter['$or'] = [];
      }
      if (status.includes('isUsed')) {
        filter['$or'].push({ isUsed: true });
      }
      if (status.includes('isExpired')) {
        filter['$or'].push({ isExpired: true });
      }
      if (status.includes('isActivated')) {
        filter['$or'].push({ isActivated: true });
      }
    }

    sortOrder = sortOrder === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const certificates = await CertificateModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'admin',
        },
      },
      {
        $match: filter,
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          data: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
        },
      },
    ]).exec();

    const items = certificates[0].data;
    const count = certificates[0].count.length
      ? certificates[0].count[0].count
      : 0;

    return {
      items,
      count,
    };
  }

  async getAllUserCertificates(skip, limit, user) {
    const userId = mongoose.Types.ObjectId(user._id);
    const filter = {
      $and: [{ ownedBy: userId }, { paymentStatus: 'PAID' }],
    };

    const certificates = await CertificateModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'admin',
        },
      },
      {
        $match: filter,
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          data: [
            {
              $sort: {
                isUsed: 1,
                isExpired: 1,
                dateStart: 1,
                value: -1,
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]).exec();

    const items = certificates[0].data;
    const count = certificates[0].count.length
      ? certificates[0].count[0].count
      : 0;

    return {
      items,
      count,
    };
  }

  async getCertificateById(id) {
    const certificate = await CertificateModel.findById(id).exec();
    if (!certificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    return certificate;
  }

  async getCertificateByParams(params) {
    const certificate = await CertificateModel.findOne(params).exec();

    if (!certificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    if (certificate.isUsed) {
      throw new RuleError(CERTIFICATE_IS_USED, BAD_REQUEST);
    }

    if (certificate.isExpired) {
      throw new RuleError(CERTIFICATE_IS_EXPIRED, BAD_REQUEST);
    }

    if (!certificate.isActivated) {
      throw new RuleError(CERTIFICATE_IS_NOT_ACTIVATED, BAD_REQUEST);
    }

    return certificate;
  }

  async generateCertificate(
    certificatesData,
    email,
    dateStart,
    userId,
    userRole
  ) {
    const certificatesArr = [];
    let certificatesPrice = 0;

    const newCertificate = {
      email,
    };

    if (userRole === USER) {
      newCertificate.ownedBy = userId;
    } else {
      newCertificate.createdBy = userId;
    }
    if (userRole === ADMIN || userRole === SUPERADMIN) {
      newCertificate.isActivated = true;
    }

    for (const certificateData of certificatesData) {
      const { value, count } = certificateData;
      certificatesPrice += value * count;

      for (let i = 0; i < count; i++) {
        newCertificate.name = await generateName();
        newCertificate.value = value;

        const futureDate = {
          dateStart: modifyDate({ date: dateStart }),
          dateEnd: modifyDate({ years: 1, date: dateStart }),
          isActive: false,
        };
        Object.assign(newCertificate, futureDate);
        certificatesArr.push({ ...newCertificate });
      }
    }
    certificatesPrice *= FONDY_PAYMENT_MULTIPLIER;

    const certificates = await CertificateModel.insertMany(certificatesArr);

    return { certificates, certificatesPrice };
  }

  async addCertificate(name, userId, userEmail) {
    const certificate = await this.getCertificateByParams({ name });

    if (certificate.ownedBy) {
      throw new RuleError(CERTIFICATE_HAVE_OWNER, BAD_REQUEST);
    }

    return CertificateModel.findOneAndUpdate(
      { name },
      { email: userEmail, ownedBy: userId },
      { new: true }
    ).exec();
  }

  async updateCertificate(name) {
    await this.getCertificateByParams({ name });

    return CertificateModel.findOneAndUpdate(
      { name },
      { isUsed: true, isActivated: false },
      { new: true }
    ).exec();
  }

  async giftCertificateToEmail(id, email, oldEmail, language) {
    const certificate = await this.getCertificateById(id);
    certificate.email = email;
    certificate.save();

    const dateEnd = certificate.dateEnd.toLocaleDateString();
    const dateStart = certificate.dateStart.toLocaleDateString();

    await sendEmail(email, RECEIVE_GIFT_SERTIFICATE, {
      certificateName: certificate.name,
      certificateValue: certificate.value,
      dateEnd,
      language,
    });
    await sendEmail(oldEmail, SEND_GIFT_CERTIFICATE, {
      certificateName: certificate.name,
      certificateValue: certificate.value,
      dateStart,
      dateEnd,
      language,
    });

    return certificate;
  }

  async deleteCertificate(id) {
    const certificateExists = await this.getCertificateById(id);

    if (!certificateExists.isUsed && !certificateExists.isExpired) {
      throw new RuleError(CERTIFICATE_IS_ACTIVE, BAD_REQUEST);
    }

    return CertificateModel.findByIdAndDelete(id).exec();
  }
}

module.exports = new CertificatesService();
