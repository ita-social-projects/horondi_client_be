const RuleError = require('../../errors/rule.error');
const Certificate = require('./certificate.model');
const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts');

const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_NOT_VALID,
  CERTIFICATE_HAVE_OWNER,
  CERTIFICATE_IS_ACTIVE,
  CERTIFICATE_IS_USED,
} = require('../../error-messages/certificate.messages');

class CertificatesService {
  async getAllCertificates(skip, limit, user) {
    let filter = {};

    if (user.role === USER) {
      filter = { ownedBy: user._id };
    }

    const items = await Certificate.find(filter)
      .sort({ startDate: 1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const count = Certificate.find(filter).countDocuments();

    return {
      items,
      count,
    };
  }

  async getCertificateById(id) {
    const certificate = await Certificate.findById(id).exec();

    if (!certificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    return certificate;
  }

  async generateCertificate(certificateData, userId, userRole) {
    const firstNamePart = Math.floor(100 + Math.random() * 900);
    const secondNamePart = Math.floor(100 + Math.random() * 900);

    const name = `hor${firstNamePart}${secondNamePart}`;

    certificateData.name = name;

    if (userRole === USER) {
      certificateData.ownedBy = userId;
    } else if (userRole === ADMIN || userRole === SUPERADMIN) {
      certificateData.createdBy = userId;
    }

    return new Certificate(certificateData).save();
  }

  async addCertificate(name, userId, userEmail) {
    const certificateExists = await Certificate.findOne({ name });

    if (
      !certificateExists ||
      certificateExists.isUsed ||
      certificateExists.isExpired
    ) {
      throw new RuleError(CERTIFICATE_NOT_VALID, BAD_REQUEST);
    }

    if (certificateExists.ownedBy) {
      throw new RuleError(CERTIFICATE_HAVE_OWNER, BAD_REQUEST);
    }

    const certificateAssigned = await Certificate.findOneAndUpdate(
      { name },
      { email: userEmail, ownedBy: userId },
      { new: true }
    ).exec();

    return certificateAssigned;
  }

  async updateCertificate(name) {
    const certificateExists = await Certificate.findOne({ name }).exec();

    if (!certificateExists) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    if (certificateExists.isUsed) {
      throw new RuleError(CERTIFICATE_IS_USED, BAD_REQUEST);
    }

    const updatedCertificate = await Certificate.findOneAndUpdate(
      { name },
      { isUsed: true },
      { new: true }
    ).exec();

    return updatedCertificate;
  }

  async deleteCertificate(id) {
    const certificateExists = await Certificate.findById(id).exec();

    if (!certificateExists) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    if (!certificateExists.isUsed && !certificateExists.isExpired) {
      throw new RuleError(CERTIFICATE_IS_ACTIVE, BAD_REQUEST);
    }

    return Certificate.findByIdAndDelete(id).exec();
  }
}

module.exports = new CertificatesService();
