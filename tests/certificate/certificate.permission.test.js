const { setupApp } = require('../helper-functions');
const { INVALID_PERMISSIONS } = require('../../error-messages/user.messages');

const {
  loginUser,
  deleteUser,
  sendEmailConfirmation,
  confirmUserEmail,
} = require('../user/user.helper');

const {
  CERTIFICATE_NOT_FOUND,
  CERTIFICATE_IS_ACTIVE,
  CERTIFICATE_IS_USED,
} = require('../../error-messages/certificate.messages');

const {
  addCertificate,
  deleteCertificate,
  generateCertificate,
  getAllCertificates,
  getAllUserCertificates,
  getCertificateById,
  getCertificateByParams,
  registerUser,
  updateCertificate,
} = require('./certificate.helper');
const {
  newCertificateInputData,
  newUser,
  email,
} = require('./certificate.variables');
const {
  RECOVERY_EXPIRE,
  CONFIRMATION_SECRET,
} = require('../../dotenvValidator');
const { JWTClient, jwtClient } = require('../../client/jwt-client');
jest.mock('../../modules/email/email.service');

describe('Run ApolloClientServer with role=admin in context', () => {
  let adminContextServer;

  let certificateId;
  let certificateName;
  let certificateParams;

  let certificateNullOwnerId;
  let certificateNullOwnerEmail;
  let certificateNullOwnerName;

  beforeAll(async () => {
    adminContextServer = await setupApp();

    const certificateNullOwner = await generateCertificate(
      [{ value: 1000, count: 1 }],
      email,
      adminContextServer
    );

    certificateNullOwnerId = certificateNullOwner.certificates[0]._id;
    certificateNullOwnerEmail = null;
    certificateNullOwnerName = certificateNullOwner.certificates[0].name;
  });

  describe('Test behaviour of USER with role=user', () => {
    let userContextServer;
    let userId;

    beforeAll(async () => {
      const register = await registerUser(newUser, adminContextServer);
      const accessTokenMock = jwtClient.createToken(
        { userId: register.data.registerUser._id },
        CONFIRMATION_SECRET,
        RECOVERY_EXPIRE
      );
      jest
        .spyOn(JWTClient.prototype, 'generateAccessToken')
        .mockImplementation(() => accessTokenMock);
      await sendEmailConfirmation(newUser.email, 1, adminContextServer);
      await confirmUserEmail(accessTokenMock, adminContextServer);
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

    afterAll(async () => {
      jest.clearAllMocks();
      await deleteCertificate(certificateNullOwnerId, adminContextServer);
      await deleteCertificate(certificateId, adminContextServer);
    });

    it('should generate certificate', async () => {
      const result = await generateCertificate(
        newCertificateInputData,
        email,
        adminContextServer
      );
      certificateId = result.certificates[0]._id;
      certificateName = result.certificates[0].name;
      certificateParams = { name: certificateName };

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

    it('should not have access to all certificates', async () => {
      const result = await getAllCertificates(undefined, [], userContextServer);

      expect(result).toHaveProperty('message', INVALID_PERMISSIONS);
      expect(result).toHaveProperty('statusCode', 403);
    });

    it("shouldn't find certificate", async () => {
      const result = await getAllUserCertificates(userContextServer);

      expect(result.count).toBe(0);
    });

    afterAll(async () => {
      await deleteUser(userId, adminContextServer);
    });

    it('should get certificate by name', async () => {
      const certificate = await getCertificateByParams(
        certificateParams,
        adminContextServer
      );

      expect(certificate.data.getCertificateByParams).toHaveProperty(
        'name',
        certificateName
      );
    });
  });

  describe('Admin restrictions and cleaning DB', () => {
    it('shouldn`t delete unused certificate', async () => {
      const result = await deleteCertificate(certificateId, adminContextServer);

      expect(result).toHaveProperty('message', CERTIFICATE_IS_ACTIVE);
    });

    it('should update certificate and throw CERTIFICATE_IS_USED', async () => {
      await updateCertificate(certificateName, adminContextServer);
      const certificate = await getCertificateByParams(
        certificateParams,
        adminContextServer
      );

      expect(certificate.errors[0]).toHaveProperty(
        'message',
        CERTIFICATE_IS_USED
      );
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

    it('should delete certificate and throw CERTIFICATE_NOT_FOUND', async () => {
      await deleteCertificate(certificateId, adminContextServer);

      const certificate = await getCertificateByParams(
        certificateParams,
        adminContextServer
      );

      expect(certificate.errors[0]).toHaveProperty(
        'message',
        CERTIFICATE_NOT_FOUND
      );
    });
  });
});
