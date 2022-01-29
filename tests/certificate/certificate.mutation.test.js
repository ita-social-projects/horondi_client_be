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

  it('#1. Certificate was successfully Generated', async () => {
    const result = await generateCertificate(
      newCertificateInputData,
      operations
    );

    certificateId = result._id;
    certificateName = result.name;
    isUsed = result.isUsed;

    expect(result).toHaveProperty('name');
  });

  it('#2. change `isUsed` field to true with updateCertificate', async () => {
    expect(isUsed).toBeFalsy();

    const result = await updateCertificate(certificateName, operations);

    expect(result.isUsed).toBeTruthy();
  });

  it('#3. Succesfuly delete certificate', async () => {
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});

describe('Test response for unexist and wrong Code', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('#1. should responde with 403 status for unapprotiate Name', async () => {
    const result = await updateCertificate('regexpfailure', operations);

    expect(result).toHaveProperty('statusCode', 403);
  });

  it('#2. should responde with 404 status for update wrong Name', async () => {
    const result = await updateCertificate(wrongName, operations);

    expect(result).toHaveProperty('statusCode', 404);
  });

  it('#3. should responde with CERTIFICATE_NOT_FOUND for delete wrong Id', async () => {
    const result = await deleteCertificate(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});
