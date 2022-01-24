const { setupApp } = require('../helper-functions');
const { INVALID_PERMISSIONS } = require('../../error-messages/user.messages');

const { newUser } = require('../user/user.variables');
const { loginUser, deleteUser } = require('../user/user.helper');

const {
  registerUser,
  deleteCertificate,
  addCertificate,
  getAllCertificates,
  getCertificateById,
  generateCertificate,
} = require('./certificate.helper');
const { newCertificateInputData } = require('./certificate.variables');

let operations;
let certificateId;
let userId;

describe('Test behaviout of USER with role=user', () => {
  beforeAll(async () => {
    operations = await setupApp({}); // user - zero

    await registerUser(newUser, operations);

    userId = newUser._id;

    const userRes = await loginUser(
      newUser.email,
      newUser.password,
      false,
      operations
    );

    operations = await setupApp(userRes.data.loginUser);
  });

  it('#0. User can generate certificate', async () => {
    const result = await generateCertificate(
      newCertificateInputData,
      operations
    );
    certificateId = result._id;
    expect(result).toHaveProperty('name', newCertificateInputData.name);
  });

  it('#1. User can add certificate that was bought offilne', async () => {
    await addCertificate(newCertificateInputData.name, operations);

    const result = await getCertificateById(certificateId, operations);
    // SECURITY PROBLEM!
    certificateId = result._id;
    expect(result.email).toEquel(newUser.email);
  });

  it("#2. User can't remove his certificate", async () => {
    const result = await deleteCertificate(certificateId, operations);
    expect(result).toHaveProperty('message', INVALID_PERMISSIONS);
  });
  it('#3. User can see only certificates created by him', async () => {
    const result = await getAllCertificates(operations);
    expect(result.count).toBe(1);
  });
});

describe('Delete Certificate and user as Admin', () => {
  it('Succesfuly delete certificate', async () => {
    operations = await setupApp();
    await deleteUser(userId, operations);
    await deleteCertificate(certificateId, operations);
    const result = await getCertificateById(certificateId, operations);
    expect(result).toHaveProperty('message', 'CERTIFICATE_NOT_FOUND');
  });
});
