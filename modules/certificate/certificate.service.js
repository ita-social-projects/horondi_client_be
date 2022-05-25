const { randomInt } = require('crypto');
const RuleError = require('../../errors/rule.error');
const mongoose = require('mongoose');
const { CertificateModel } = require('./certificate.model');
const {
  roles: { USER },
} = require('../../consts');

const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  CERTIFICATE_HAVE_OWNER,
  CERTIFICATE_IS_ACTIVE,
  CERTIFICATE_IS_EXPIRED,
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
  async getAllCertificates(
    skip,
    limit,
    sortBy,
    sortOrder,
    search,
    status,
    user
  ) {
    let filter = {};

    if (user.role === USER) {
      const userId = mongoose.Types.ObjectId(user._id);
      filter = { ownedBy: userId };
    } else {
      this.filterByName(filter, search);
    }
    if (status.length) {
      if (!Object.keys(filter).length) {
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

    for (const certificateData of certificatesData) {
      const { value, count } = certificateData;
      certificatesPrice += value * count;

      for (let i = 0; i < count; i++) {
        newCertificate.name = await generateName();
        newCertificate.value = value;

        if (dateStart) {
          const futureDate = {
            dateStart,
            dateEnd: modifyDate({ years: 1, date: dateStart }),
            isActive: false,
          };
          Object.assign(newCertificate, futureDate);
        }

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

  async deleteCertificate(id) {
    const certificateExists = await this.getCertificateById(id);

    if (!certificateExists.isUsed && !certificateExists.isExpired) {
      throw new RuleError(CERTIFICATE_IS_ACTIVE, BAD_REQUEST);
    }

    return CertificateModel.findByIdAndDelete(id).exec();
  }
}

module.exports = new CertificatesService();
