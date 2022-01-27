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
const { wrongId, newCertificateInputData } = require('./certificate.variables');

let operations;
let certificateId;
let certificateName;

describe('Test certificate Queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await generateCertificate(
      newCertificateInputData,
      operations
    );
    certificateId = certificateData._id;
    certificateName = certificateData.name;
  });

  it('#1. check unique field in one of certificates in list', async () => {
    const result = await getAllCertificates(operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it('#2. get fresh-generated certificate', async () => {
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('name', certificateName);
  });

  it('#3.get CERTIFICATE_NOT_FOUND for unexist certificate', async () => {
    const result = await getCertificateById(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });

  afterAll(async () => {
    await updateCertificate(certificateName, operations);
    await deleteCertificate(certificateId, operations);
  });
});
