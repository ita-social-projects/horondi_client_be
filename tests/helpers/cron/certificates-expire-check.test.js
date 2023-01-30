jest.mock('node-cron', () => ({
  schedule: (msg, cb) => cb(),
}));

let isCalledManyUpdate = false;
let isCalledFind = false;
let isCalledSender = false;
let isCalledFindOne = false;

jest.mock('../../../modules/user/user.model', () => ({
  findOne: () => ({
    exec: () => {
      isCalledFindOne = true;

      return { configs: { language: 'ua' } };
    },
  }),

  find: () => ({
    exec: () => {
      isCalledFind = true;

      return [{ email: 'test@test.com' }];
    },
  }),
}));

jest.mock('../../../modules/certificate/certificate.model', () => ({
  CertificateModel: {
    updateMany: () => ({ exec: () => (isCalledManyUpdate = true) }),

    find: () => ({
      exec: () => {
        isCalledFind = true;

        return [{ email: 'test@test.com' }];
      },
    }),
  },
}));

jest.mock('../../../modules/email/email.service.js', () => ({
  sendEmail: () => {
    isCalledSender = true;

    return 'sended';
  },
}));

const {
  certificatesExpireCheck,
} = require('../../../helpers/cron-job/certificates-expire-check.js');

describe('Cron job check', () => {
  it('Mongo methods and emailSender were called', async () => {
    await certificatesExpireCheck();

    expect(isCalledFindOne).toBeTruthy();

    expect(isCalledManyUpdate).toBeTruthy();

    expect(isCalledFind).toBeTruthy();

    expect(isCalledSender).toBeTruthy();
  });
});
