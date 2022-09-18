const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_IS_USED,
} = require('../../error-messages/certificate.messages');
const {
  deleteCertificate,
  generateCertificate,
  updateCertificate,
  getCertificateById,
  getCertificateByParams,
  giftCertificateToEmail,
} = require('./certificate.helper');
const {
  wrongId,
  wrongName,
  email,
  newEmail,
  language,
  newCertificateInputData,
} = require('./certificate.variables');

jest.mock('../../modules/email/email.service');

let operations;
let certificateId;
let certificateName;
let certificateParams;
let isUsed;

describe('Test mutation methods Admin', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should generate certificate', async () => {
    const result = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );

    certificateId = result.certificates[0]._id;
    certificateName = result.certificates[0].name;
    isUsed = result.certificates[0].isUsed;
    certificateParams = { name: certificateName };

    expect(result.certificates[0]).toHaveProperty('name');
  });
  it('should change certificate email', async () => {
    const result = await giftCertificateToEmail(
      certificateId,
      newEmail,
      email,
      language,
      operations
    );
    expect(result.email).toBe(newEmail);
  });

  it('should change `isUsed` field to true with updateCertificate', async () => {
    expect(isUsed).toBeFalsy();

    const updateResult = await updateCertificate(certificateName, operations);
    const getResult = await getCertificateByParams(
      certificateParams,
      operations
    );

    expect(updateResult.isUsed).toBeTruthy();
    expect(getResult.errors[0]).toHaveProperty('message', CERTIFICATE_IS_USED);
  });
  it('should delete certificate', async () => {
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });

  it('should delete certificate and throw error CERTIFICATE_NOT_FOUND', async () => {
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateByParams(certificateParams, operations);

    expect(result.errors[0]).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
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
