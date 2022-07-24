const { setupApp } = require('../helper-functions');
const {
  CERTIFICATE_NOT_FOUND,
} = require('../../error-messages/certificate.messages');
const {
  deleteCertificate,
  generateCertificate,
  getAllCertificates,
  getCertificateById,
  getCertificateByName,
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

  afterAll(async () => {
    await updateCertificate(certificateName, operations);
    await deleteCertificate(certificateId, operations);
  });

  it('should check unique field in one of certificates in list', async () => {
    const result = await getAllCertificates('', operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it("should filter certificates by search admin's name", async () => {
    const result = await getAllCertificates('admin', operations);

    expect(result.items[0]).toHaveProperty('isUsed');
  });

  it('should give an empty array for an unsuccessful search', async () => {
    const result = await getAllCertificates('Hello World', operations);

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
    const result = await getCertificateByName(certificateName, operations);
    expect(result.data.getCertificateByName).toHaveProperty('name', certificateName);
  });

  it('should throw error CERTIFICATE_NOT_FOUND for get certificate by name', async () => {
    const result = await getCertificateByName(wrongName, operations);

    expect(result.errors[0]).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
    expect(result.data.getCertificateByName).toEqual(null);
  });
  
});
