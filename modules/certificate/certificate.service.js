const { randomInt } = require('crypto');
const RuleError = require('../../errors/rule.error');
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

const generateName = async () => {
  const firstNamePart = Math.floor(randomInt(1000, 9999));
  const secondNamePart = Math.floor(randomInt(1000, 9999));
  const name = `HOR${firstNamePart}${secondNamePart}`;
  const candidate = await CertificateModel.findOne({ name });
  if (candidate) {
    return generateName();
  }
  return name;
};

class CertificatesService {
  async getAllCertificates(skip, limit, user) {
    let filter = {};

    if (user.role === USER) {
      filter = { ownedBy: user._id };
    }
    const items = await CertificateModel.find(filter)
      .sort({ startDate: 1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const count = items.length;

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

  async generateCertificate(certificateData, userId, userRole) {
    const certificatesArr = [];
    const { count } = certificateData;

    if (userRole === USER) {
      certificateData.ownedBy = userId;
    } else {
      certificateData.createdBy = userId;
    }

    for (let i = 0; i < count; i++) {
      certificateData.name = await generateName();
      certificatesArr.push({ ...certificateData });
    }

    const certificates = await CertificateModel.insertMany(certificatesArr);

    return { certificates };
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
      { isUsed: true },
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
