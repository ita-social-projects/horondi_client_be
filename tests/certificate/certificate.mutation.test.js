const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const {
  deleteCertificate,
  addCertificate,
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
let isUsed;

describe.skip('Test mutation methods', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('#1. create certificate', async () => {
    const result = await addCertificate(newCertificateInputData, operations);
    certificateId = result._id;
    isUsed = result.isUsed;

    expect(result).toHaveProperty('name', newCertificateInputData.name);
  });

  it('#2. update certificate change isUsed field to true', async () => {
    expect(isUsed).toBeFalsy();

    const result = await updateCertificate(
      newCertificateInputData.name,
      operations
    );

    expect(result.isUsed).toBeTruthy();
  });

  it('#3. Succesfuly delete certificate', async () => {
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});

describe.skip('Test response for unexist ID', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('#1. 404 status for update wrong Name', async () => {
    const result = await updateCertificate(wrongName, operations);

    expect(result).toHaveProperty('statusCode', 404);
  });

  it('#2. CERTIFICATE_NOT_FOUND for delete wrong Id', async () => {
    const result = await deleteCertificate(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});
