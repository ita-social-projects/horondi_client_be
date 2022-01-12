const { setupApp } = require('../helper-functions');
const { INVALID_PERMISSIONS } = require('../../error-messages/user.messages');
const {
  deleteCertificate,
  addCertificate,
  getAllCertificates,
  getCertificateById,
} = require('./certificate.helper');
const { newCertificateInputData } = require('./certificate.variables');

let operations;
let certificateId;
describe('Test behaviout of USER role', () => {
  beforeAll(async () => {
    operations = await setupApp('user');
  });

  it('#1. User can add certificate', async () => {
    const result = await addCertificate(newCertificateInputData, operations);
    certificateId = result._id;
    expect(result).toHaveProperty('name', newCertificateInputData.name);
  });

  it("#2. User can't remove certificate", async () => {
    const result = await deleteCertificate(certificateId, operations);
    expect(result).toHaveProperty('message', INVALID_PERMISSIONS);
  });
  it('#3. User can see only certificates created by him', async () => {
    const result = await getAllCertificates(operations);
    expect(result.count).toBe(1);
  });
});

describe('Delete Certificate as Admin', () => {
  it('Succesfuly delete certificate', async () => {
    operations = await setupApp();
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateById(certificateId, operations);
    expect(result).toHaveProperty('message', 'CERTIFICATE_NOT_FOUND');
  });
});
