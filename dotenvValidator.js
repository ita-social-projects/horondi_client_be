const joi = require('@hapi/joi');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const dotenvVariables = [
  'MONGO_URL',
  'SECRET',
  'TOKEN_EXPIRES_IN',
  'REFRESH_TOKEN_EXPIRES_IN',
  'BASE_URI',
  'TEST_BASE_URI',
  'IMAGE_LINK',
  'STORAGE_ACCOUNT',
  'ACCESS_KEY',
  'AZURE_HOST',
  'PAYMENT_SECRET',
  'PAYMENT_MERCHANT_ID',
  'NOVA_POSHTA_API_LINK',
  'NOVA_POSHTA_API_KEY',
  'PAYMENT_API_LINK',
  'MAIL_USER',
  'MAIL_PASS',
  'MAIL_HOST',
  'MAIL_PORT',
  'GMAIL_API_ID',
  'GMAIL_API_SECRET',
  'GMAIL_API_REDIRECT_URI',
  'GMAIL_API_REFRESH_TOKEN',
  'RECOVERY_EXPIRE',
  'FRONT_BASE_URI',
  'TEST_BASE_URI',
  'CURRENCY_API_URL',
  'CONFIRMATION_SECRET',
  'RECOVERY_EXPIRE',
  'SUPER_ADMIN_EMAIL',
  'SUPER_ADMIN_PASSWORD',
  'SENDGRID_API_KEY',
  'REACT_APP_GOOGLE_CLIENT_ID',
  'UKR_POSHTA_API_LINK',
  'UKR_POSHTA_API_KEY',
  'UKR_POSHTA_STATUS_KEY',
  'UKR_POSHTA_COUNTERPARTY_TOKEN',
  'UKR_POSHTA_COUNTERPARTY_UUID',
  'UKR_POSHTA_ADDRESS_API_LINK',
  'CONTRIBUTING',
  'GMAIL_EMAIL_SERVICE',
  'ADMIN_BASE_URI',
];

function dotenvValidator(processEnv) {
  const envSchema = joi.object({
    MONGO_URL: joi.string().uri().required(),
    SECRET: joi.string().required(),
    TOKEN_EXPIRES_IN: joi.string().required(),
    REFRESH_TOKEN_EXPIRES_IN: joi.string().required(),
    BASE_URI: joi.string().uri().required(),
    IMAGE_LINK: joi.string().uri().required(),
    STORAGE_ACCOUNT: joi.string(),
    AZURE_HOST: joi.string().uri(),
    PAYMENT_SECRET: joi.string().required(),
    PAYMENT_MERCHANT_ID: joi.number().required(),
    NOVA_POSHTA_API_LINK: joi.string().uri().required(),
    NOVA_POSHTA_API_KEY: joi.string().required(),
    PAYMENT_API_LINK: joi.string().uri().required(),
    MAIL_USER: joi.string().email().required(),
    RECOVERY_EXPIRE: joi.string().required(),
    FRONT_BASE_URI: joi.string().uri().required(),
    ADMIN_BASE_URI: joi.string().uri().required(),
    TEST_BASE_URI: joi.string().uri().required(),
    SUPER_ADMIN_EMAIL: joi.string().email().required(),
    SUPER_ADMIN_PASSWORD: joi.string().required(),
    CURRENCY_API_URL: joi.string().uri().required(),
    CONFIRMATION_SECRET: joi.string().required(),
    SENDGRID_API_KEY: joi.string().required(),
    REACT_APP_GOOGLE_CLIENT_ID: joi.string().required(),
    UKR_POSHTA_API_LINK: joi.string().uri(),
    UKR_POSHTA_ADDRESS_API_LINK: joi.string().uri(),
    UKR_POSHTA_API_KEY: joi.string(),
    UKR_POSHTA_STATUS_KEY: joi.string(),
    UKR_POSHTA_COUNTERPARTY_TOKEN: joi.string(),
    UKR_POSHTA_COUNTERPARTY_UUID: joi.string(),
    CONTRIBUTING: joi.boolean(),
    GMAIL_EMAIL_SERVICE: joi.string(),
    GMAIL_API_ID: joi.string(),
    GMAIL_API_SECRET: joi.string(),
    GMAIL_API_REDIRECT_URI: joi.string().uri(),
    GMAIL_API_REFRESH_TOKEN: joi.string(),
  });

  const environment = envSchema.validate(processEnv, { allowUnknown: true });

  if (environment.error) {
    throw environment.error;
  }

  return { ...environment.value };
}

dotenvValidator(process.env);
module.exports = { ...process.env, dotenvVariables };
