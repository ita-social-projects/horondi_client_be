const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const {
  deleteCertificate,
  addCertificate,
  getAllCertificates,
  getCertificateById,
} = require('./certificate.helper');
const { wrongId, newCertificateInputData } = require('./certificate.variables');

let operations;
let certificateId;

describe('Test certificate Queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await addCertificate(
      newCertificateInputData,
      operations
    );
    certificateId = certificateData._id;
  });

  it('#2. check unique field in one of certificates in list', async () => {
    const result = await getAllCertificates(operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it('#3. get fresh-generated certificate', async () => {
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('name', newCertificateInputData.name);
  });

  it('#4.get CERTIFICATE_NOT_FOUND for unexist certificate', async () => {
    const result = await getCertificateById(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteCertificate(certificateId, operations);
  });
});
