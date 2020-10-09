const envalid = require('envalid');
const { url, email, str, num, port } = envalid;
const dotenv = require('dotenv');

function dotenvValidator() {
  const env = envalid.cleanEnv(
    process.env,
    {
      MONGO_URL: url(),
      SECRET: str(),
      EXPIRES_IN: str(),
      BASE_URI: url(),
      TEST_BASE_URI: url(),
      KEY_VAULTS_URI: url(),
      TEST_MONGO: url(),
      IMAGE_LINK: url(),
      STORAGE_ACCOUNT: str(),
      ACCESS_KEY: str(),
      AZURE_HOST: url(),
      PAYMENT_SECRET: str(),
      PAYMENT_MERCHANT_ID: num(),
      NOVA_POSHTA_API_LINK: url(),
      NOVA_POSHTA_API_KEY: str(),
      PAYMENT_API_LINK: url(),
      MAIL_USER: email(),
      MAIL_PASS: str(),
      MAIL_HOST: str(),
      MAIL_PORT: port(),
      RECOVERY_EXPIRE: str(),
      FRONT_BASE_URI: url(),
      TEST_BASE_URI: url(),
      SUPER_ADMIN_EMAIL: email(),
      SUPER_ADMIN_PASSWORD: str(),
      CURRENCY_API_URL: url(),
      CONFIRMATION_SECRET: str(),
      RECOVERY_EXPIRE: str(),
      SENDGRID_API_KEY: str(),
    },
    {
      reporter: ({ errors }) => {
        throw new Error('Invalid env vars: ' + Object.keys(errors));
      },
    }
  );
  return env;
}

console.log(dotenvValidator());

module.exports = dotenv;
