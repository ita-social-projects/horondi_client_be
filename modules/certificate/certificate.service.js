const Certificate = require('./certificate.model');
const RuleError = require('../../errors/rule.error');

const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const {
  CERTIFICATE_STATUSES: { USED },
} = require('../../consts/certificate-statuses');

class CertificatesService {
  async getAllCertificates(skip, limit) {
    const items = await Certificate.find()
      .sort({ status: 'asc' })
      .limit(limit)
      .skip(skip)
      .exec();

    const count = Certificate.find().countDocuments();

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

  async addCertificate(name, value, dateStart, dateEnd) {
    return new Certificate({ name, value, dateStart, dateEnd }).save();

    /* const addedCertificate = await Certificate.create({
      name,
      value,
      dateStart,
      dateEnd,
    }).exec(); 

    if (!addedCertificate) {
      throw new RuleError(CERTIFICATE_NOT_FOUND, NOT_FOUND);
    }
    return addedCertificate; */
  }

  /** Як варіант Апдейт може бути тільки на Використаний
   * active: true or false. Якщо status змінений used: false і active: false - значить експайрд
   */
  async updateCertificate(id) {
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      { status: USED },
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
