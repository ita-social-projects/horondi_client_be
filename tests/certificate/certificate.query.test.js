const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const {
  deleteCertificate,
  generateCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
} = require('./certificate.helper');
const {
  wrongId,
  newCertificateInputData,
  email,
} = require('./certificate.variables');

let operations;
let certificateId;
let certificateName;

describe('Test certificate Queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );
    certificateId = certificateData.certificates[0]._id;
    certificateName = certificateData.certificates[0].name;
  });

  it('should check unique field in one of certificates in list', async () => {
    const result = await getAllCertificates(operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it('should get fresh-generated certificate', async () => {
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('name', certificateName);
  });

  it('should get CERTIFICATE_NOT_FOUND for unexist certificate', async () => {
    const result = await getCertificateById(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });

  afterAll(async () => {
    await updateCertificate(certificateName, operations);
    await deleteCertificate(certificateId, operations);
  });
});
