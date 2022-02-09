const { setupApp } = require('../helper-functions');
const { INVALID_PERMISSIONS } = require('../../error-messages/user.messages');

const { loginUser, deleteUser } = require('../user/user.helper');

const {
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_IS_ACTIVE,
} = require('../../error-messages/certificate.messages');

const {
  addCertificate,
  deleteCertificate,
  generateCertificate,
  getAllCertificates,
  getCertificateById,
  registerUser,
  updateCertificate,
} = require('./certificate.helper');
const { newCertificateInputData, newUser } = require('./certificate.variables');

describe('Run ApolloClientServer with role=admin in context', () => {
  let adminContextServer;

  let certificateId;
  let certificateName;

  let certificateNullOwnerId;
  let certificateNullOwnerEmail;
  let certificateNullOwnerName;

  beforeAll(async () => {
    adminContextServer = await setupApp();

    const certificateNullOwner = await generateCertificate(
      { value: 1000, count: 1 },
      adminContextServer
    );

    certificateNullOwnerId = certificateNullOwner.certificates[0]._id;
    certificateNullOwnerEmail = certificateNullOwner.certificates[0].email;
    certificateNullOwnerName = certificateNullOwner.certificates[0].name;
  });

  describe('Test behaviour of USER with role=user', () => {
    let userContextServer;
    let userId;

    beforeAll(async () => {
      await registerUser(newUser, adminContextServer);

      const {
        data: { loginUser: userObject },
      } = await loginUser(
        newUser.email,
        newUser.password,
        false,
        adminContextServer
      );
      userObject.banned = { blockPeriod: '0' };
      userId = userObject._id;

      userContextServer = await setupApp(userObject);
    });

    it('should generate certificate', async () => {
      const result = await generateCertificate(
        newCertificateInputData,
        userContextServer
      );
      certificateId = result.certificates[0]._id;
      certificateName = result.certificates[0].name;

      expect(result.certificates[0]).toHaveProperty('name');
    });

    it('should add certificate that was bought offilne', async () => {
      expect(certificateNullOwnerEmail).toBe(null);

      const result = await addCertificate(
        certificateNullOwnerName,
        userContextServer
      );

      expect(result.email).toBe(newUser.email);
    });

    it("shouldn't remove his certificate", async () => {
      const result = await deleteCertificate(certificateId, userContextServer);

      expect(result).toHaveProperty('message', INVALID_PERMISSIONS);
    });

    it('should see only certificates owned by him', async () => {
      const result = await getAllCertificates(userContextServer);

      expect(result.count).toBe(2);
    });

    afterAll(async () => {
      await deleteUser(userId, adminContextServer);
    });
  });

  describe('Admin restrictions and cleaning DB', () => {
    it('shouldn`t delete unused certificate', async () => {
      const result = await deleteCertificate(certificateId, adminContextServer);

      expect(result).toHaveProperty('message', CERTIFICATE_IS_ACTIVE);
    });

    it('shouldn`t use addCertificate method', async () => {
      const result = await addCertificate(
        certificateNullOwnerName,
        adminContextServer
      );

      expect(result).toHaveProperty('statusCode', 403);
    });

    it('should delete user`s certificates', async () => {
      await updateCertificate(certificateName, adminContextServer);
      await deleteCertificate(certificateId, adminContextServer);

      const certificate = await getCertificateById(
        certificateId,
        adminContextServer
      );

      expect(certificate).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
    });

    it('should delete certificate generated by Admin', async () => {
      await updateCertificate(certificateNullOwnerName, adminContextServer);
      await deleteCertificate(certificateNullOwnerId, adminContextServer);

      const certificate = await getCertificateById(
        certificateNullOwnerId,
        adminContextServer
      );

      expect(certificate).toHaveProperty('message', CERTIFICATE_NOT_FOUND);
    });
  });

  afterAll(async () => {
    await deleteCertificate(certificateNullOwnerId, adminContextServer);
    await deleteCertificate(certificateId, adminContextServer);
  });
});
