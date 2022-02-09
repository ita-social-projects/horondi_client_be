const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const {
  deleteCertificate,
  generateCertificate,
  updateCertificate,
  getCertificateById,
} = require('./certificate.helper');
const {
  wrongId,
  wrongName,
  newCertificateInputData,
} = require('./certificate.variables');

let operations;
let certificateId;
let certificateName;
let isUsed;

describe('Test mutation methods Admin', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should generate certificate', async () => {
    const result = await generateCertificate(
      newCertificateInputData,
      operations
    );

    certificateId = result.certificates[0]._id;
    certificateName = result.certificates[0].name;
    isUsed = result.certificates[0].isUsed;

    expect(result.certificates[0]).toHaveProperty('name');
  });

  it('should change `isUsed` field to true with updateCertificate', async () => {
    expect(isUsed).toBeFalsy();

    const result = await updateCertificate(certificateName, operations);

    expect(result.isUsed).toBeTruthy();
  });

  it('should delete certificate', async () => {
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});

describe('Test response for unexist and wrong Code', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should responde with 403 status for unapprotiate Name', async () => {
    const result = await updateCertificate('regexpfailure', operations);

    expect(result).toHaveProperty('statusCode', 403);
  });

  it('should responde with 404 status for update wrong Name', async () => {
    const result = await updateCertificate(wrongName, operations);

    expect(result).toHaveProperty('statusCode', 404);
  });

  it('should responde with CERTIFICATE_NOT_FOUND for delete wrong Id', async () => {
    const result = await deleteCertificate(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});
