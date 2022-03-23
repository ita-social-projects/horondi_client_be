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
    console.log(result);
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
});

describe('Test getCertificatesByToken flow', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const certificateData = await generateCertificate(
      newCertificateInputData,
      email,
      operations
    );
    certificates = certificateData.certificates;
    certificateId = certificateData.certificates[0]._id;

    const result = await getPaymentCheckoutForCertificates(
      { certificates, currency: 'UAH', amount: '100000' },
      operations
    );
    paymentToken = result.paymentToken;
  });

  afterAll(async () => {
    await updateCertificate(certificateName, operations);
    await deleteCertificate(certificateId, operations);
  });

  it('should get certificates by payment token', async () => {
    const result = await getCertificatesByPaymentToken(
      paymentToken,
      operations
    );

    expect(result).toHaveProperty('paymentStatus', 'PROCESSING');
  });
});
