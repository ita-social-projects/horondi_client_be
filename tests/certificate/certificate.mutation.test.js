const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_UPDATE_STATUS: { USED, IN_PROGRESS },
} = require('../../consts/certificate-update-status');
const {
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_IS_USED,
  CERTIFICATE_IN_PROGRESS,
} = require('../../error-messages/certificate.messages');
const {
  getAllCertificates,
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
const { loginAdmin } = require('../user/user.helper');
const { superAdminUser } = require('../user/user.variables');

jest.mock('../../modules/email/email.service');

let operations;
let certificateId;
let certificateName;
let certificateParams;
let isUsed;
let adminId;

describe('Test mutation methods Admin', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const authRes = await loginAdmin(
      superAdminUser.email,
      superAdminUser.password,
      operations
    );
    adminId = authRes.data.loginAdmin._id;
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
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

  it('should filter certificates by "inProgress" status', async () => {
    const result = await getAllCertificates('', ['inProgress'], operations);

    expect(result.count).toBe(0);
  });

  it('should filter certificates by "inUsed" status', async () => {
    const result = await getAllCertificates('', ['inUsed'], operations);

    expect(result).toBe(null);
  });

  it('should change `inProgress` field to true with updateCertificate', async () => {
    const updateResult = await updateCertificate(
      certificateParams,
      IN_PROGRESS,
      operations
    );
    const getResult = await getCertificateByParams(
      certificateParams,
      operations
    );

    expect(updateResult.inProgress).toBeTruthy();
    expect(getResult.errors[0]).toHaveProperty(
      'message',
      CERTIFICATE_IN_PROGRESS
    );
  });

  it('should change `isUsed` field to true with updateCertificate', async () => {
    expect(isUsed).toBeFalsy();

    const updateResult = await updateCertificate(
      certificateParams,
      USED,
      operations
    );
    const getResult = await getCertificateByParams(
      certificateParams,
      operations
    );

    expect(updateResult.isUsed).toBeTruthy();
    expect(getResult.errors[0]).toHaveProperty('message', CERTIFICATE_IS_USED);
  });

  it('should delete certificate', async () => {
    await deleteCertificate(certificateId, adminId, operations);
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });

  it('should delete certificate and throw error CERTIFICATE_NOT_FOUND', async () => {
    await deleteCertificate(certificateId, adminId, operations);
    const result = await getCertificateByParams(certificateParams, operations);

    expect(result.errors[0]).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});

describe('Test response for unexist and wrong Code', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should responde with 404 status for update wrong Name', async () => {
    const result = await getCertificateByParams(
      { name: wrongName },
      operations
    );

    expect(result.errors[0].extensions).toHaveProperty('code', 404);
  });

  it('should responde with CERTIFICATE_NOT_FOUND for delete wrong Id', async () => {
    const result = await deleteCertificate(wrongId, adminId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });
});
