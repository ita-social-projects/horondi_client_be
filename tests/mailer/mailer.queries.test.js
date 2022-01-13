const {
  Mailer,
  sendMessage,
  createMailer,
  closeConnection,
} = require('./mailer.helper');

const {
  transportOptions,
  messageOptions,
  wrongMessageOptions,
} = require('./mailer.variables');

let mailer;
let onMailError;

describe('Email API queries', () => {
  describe('Test mail constructor', () => {
    beforeAll(() => {
      onMailError = jest.fn();
      mailer = createMailer(transportOptions, onMailError);
    });

    test('Mailer should be defined', () => {
      expect(Mailer).toBeDefined();
    });

    test('Should create Mailer object', () => {
      expect(mailer).toBeDefined();
    });

    test('Should throw an error when mailer creating without parameters', () => {
      const createEmptyMailer = () => {
        createMailer();
      };
      expect(createEmptyMailer).toThrowError();
    });

    test('Should throw an error when mailer creating without parameter', () => {
      const incompleteTransportOptions = { ...transportOptions };
      delete incompleteTransportOptions.clientId;

      const createEmptyMailer = () => {
        createMailer({ incompleteTransportOptions });
      };

      expect(createEmptyMailer).toThrowError();
    });
  });

  describe('Test mailer authentication', () => {
    beforeAll(() => {
      onMailError = jest.fn();
      mailer = createMailer(transportOptions, onMailError);
    });

    test('Should have functionality for getting access token', () => {
      expect(mailer.getAccessToken).toBeDefined();
    });

    test('Should close connections to be defined', () => {
      expect(mailer.closeConnection).toBeDefined();
    });

    afterEach(() => {
      closeConnection(mailer);
    });
  });

  describe('Test mail sending', () => {
    beforeAll(() => {
      onMailError = jest.fn();
      mailer = createMailer(transportOptions, onMailError);
    });

    test('Should send message', async () => {
      const messageResult = await mailer.sendMail(messageOptions);

      expect(messageResult).toBeDefined();
      expect(typeof messageResult).toBe('object');
    });

    test('Should process error on message sending', async () => {
      await sendMessage(mailer, wrongMessageOptions);
      expect(onMailError).toHaveBeenCalled();
    });

    test('Should return result anyway', async () => {
      expect(await sendMessage(mailer, wrongMessageOptions)).toBeDefined();
    });

    afterEach(() => {
      closeConnection(mailer);
    });
  });
});
