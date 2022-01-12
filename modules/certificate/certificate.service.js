const Certificate = require('./certificate.model');
const RuleError = require('../../errors/rule.error');

const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');

class CertificatesService {
  async getAllCertificates(skip, limit, user) {
    let filter;
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      filter = {};
    } else {
      filter = { createdBy: user.id };
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

  async addCertificate(name, value, id) {
    return new Certificate({ name, value, createdBy: id }).save();
  }

  async updateCertificate(id) {
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      { isUsed: true },
      { new: true }
    ).exec();

    if (!updatedCertificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }
    return updatedCertificate;
  }

  async deleteCertificate(id) {
    const deletedCertificate = await Certificate.findById(id).exec();
    if (deletedCertificate) {
      return Certificate.findByIdAndDelete(id).exec();
    }
    throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
  }
}

module.exports = new CertificatesService();
