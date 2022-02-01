const { CertificateModel } = require('./certificate.model');
const RuleError = require('../../errors/rule.error');

const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_ALREADY_EXISTS,
} = require('../../error-messages/certificate.messages');

class CertificatesService {
  async getAllCertificates(skip, limit, user) {
    let filter;

    if (user.role === 'admin' || user.role === 'superadmin') {
      filter = {};
    } else {
      filter = { createdBy: user.id };
    }
    const items = await CertificateModel.find(filter)
      .sort({ startDate: 1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const count = CertificateModel.find(filter).countDocuments();

    return {
      items,
      count,
    };
  }

  async getCertificateById(definedArg) {
    const certificate = await CertificateModel.findById(definedArg).exec();

    if (!certificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    return certificate;
  }

  async addCertificate(name, value, id) {
    const certificateExists = await CertificateModel.findOne({ name });

    if (certificateExists) {
      throw new RuleError(CERTIFICATE_ALREADY_EXISTS, BAD_REQUEST);
    }

    return new CertificateModel({ name, value, createdBy: id }).save();
  }

  async updateCertificate(name) {
    const updatedCertificate = await CertificateModel.findOneAndUpdate(
      { name },
      { isUsed: true },
      { new: true }
    ).exec();

    if (!updatedCertificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }

    return updatedCertificate;
  }

  async deleteCertificate(id) {
    const deletedCertificate = await CertificateModel.findById(id).exec();

    if (deletedCertificate) {
      return CertificateModel.findByIdAndDelete(id).exec();
    }

    throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
  }
}

module.exports = new CertificatesService();
