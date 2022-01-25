const Certificate = require('./certificate.model');
const RuleError = require('../../errors/rule.error');

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

    if (user.role === 'user') {
      filter = { ownedBy: user.id };
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

  async getCertificateById(definedArg) {
    const certificate = await Certificate.findById(definedArg).exec();

    if (!certificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    return certificate;
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

    const certificateAssigned = await Certificate.findByIdAndUpdate(
      certificateExists._id,
      { email: userEmail, ownedBy: userId }
    ).exec();

    return certificateAssigned;
  }

  async updateCertificate(name) {
    const updatedCertificate = await Certificate.findOneAndUpdate(
      { name },
      { isUsed: true },
      { new: true }
    ).exec();

    if (!updatedCertificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    if (updatedCertificate.isUsed) {
      throw new RuleError(CERTIFICATE_IS_USED, BAD_REQUEST);
    }

    return updatedCertificate;
  }

  async deleteCertificate(id) {
    const deletedCertificate = await Certificate.findById(id).exec();

    if (!deletedCertificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    if (!deletedCertificate.isUsed || !deletedCertificate.isExpired) {
      throw new RuleError(CERTIFICATE_IS_ACTIVE, BAD_REQUEST);
    }

    return Certificate.findByIdAndDelete(id).exec();
  }
}

module.exports = new CertificatesService();
