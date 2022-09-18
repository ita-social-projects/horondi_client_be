const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND, CERTIFICATE_IN_PROGRESS
} = require('../../error-messages/certificate.messages');
const {
  CERTIFICATE_UPDATE_STATUS: { USED, IN_PROGRESS },
} = require('../../consts/certificate-update-status');
const {
  deleteCertificate,
  generateCertificate,
  getAllCertificates,
  getCertificateById,
  getCertificateByParams,
  updateCertificate,
} = require('./certificate.helper');
const {
  wrongId,
  wrongName,
  newCertificateInputData,
  email,
} = require('./certificate.variables');

let operations;
let certificateId;
let certificateName;
let certificateParams;

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
    certificateParams = { name: certificateName };
  });

  afterAll(async () => {
    await updateCertificate(certificateParams, USED, operations);
    await deleteCertificate(certificateId, operations);
  });

  it('should check unique field in one of certificates in list', async () => {
    const result = await getAllCertificates('', [], operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it('should filter certificates by status "isActivated" ', async () => {
    const result = await getAllCertificates('', ['isActivated'], operations);

    expect(result.count).toBe(3);
  });

  it('should filter certificates by status "isExpired" ', async () => {
    const result = await getAllCertificates('', ['isExpired'], operations);

    expect(result.count).toBe(0);
  });

  it('should filter certificates by status "inProgress" ', async () => {
    const result = await getAllCertificates('', ['inProgress'], operations);

    expect(result.count).toBe(0);
  });

  it("should filter certificates by search admin's name", async () => {
    const result = await getAllCertificates('admin', [], operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it('should give an empty array for an unsuccessful search', async () => {
    const result = await getAllCertificates('Hello World', [], operations);

    expect(result.items).toEqual([]);
  });

  it('should get a fresh-generated certificate', async () => {
    const result = await getCertificateById(certificateId, operations);

    expect(result).toHaveProperty('name', certificateName);
  });

  it('should get CERTIFICATE_NOT_FOUND for an unexist certificate', async () => {
    const result = await getCertificateById(wrongId, operations);

    expect(result).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
  });

  it('should get a fresh-generated certificate by name', async () => {
    const result = await getCertificateByParams(certificateParams, operations);
    expect(result.data.getCertificateByParams).toHaveProperty(
      'name',
      certificateName
    );
  });

  it('should throw error CERTIFICATE_NOT_FOUND for get certificate by name', async () => {
    const result = await getCertificateByParams(
      { name: wrongName },
      operations
    );

    expect(result.errors[0]).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
    expect(result.data.getCertificateByParams).toEqual(null);
  });

  it('should throw error CERTIFICATE_IN_PROGRESS for get certificate by name', async () => {
    await updateCertificate(certificateParams, IN_PROGRESS, operations);
    const result = await getCertificateByParams(certificateParams, operations);

    expect(result.errors[0]).toHaveProperty('message', CERTIFICATE_IN_PROGRESS);
    expect(result.data.getCertificateByParams).toEqual(null);
  });
});
