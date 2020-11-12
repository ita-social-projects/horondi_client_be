const joi = require('@hapi/joi');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const dotenvVariables = [
  'MONGO_URL',
  'SECRET',
  'EXPIRES_IN',
  'BASE_URI',
  'TEST_BASE_URI',
  'KEY_VAULTS_URI',
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
  'RECOVERY_EXPIRE',
  'FRONT_BASE_URI',
  'TEST_BASE_URI',
  'CURRENCY_API_URL',
  'CONFIRMATION_SECRET',
  'RECOVERY_EXPIRE',
  'SUPER_ADMIN_EMAIL',
  'SUPER_ADMIN_PASSWORD',
  'SENDGRID_API_KEY',
];

function dotenvValidator(processEnv) {
  const envSchema = joi.object({
    MONGO_URL: joi
      .string()
      .uri()
      .required(),
    SECRET: joi.string().required(),
    EXPIRES_IN: joi.string().required(),
    BASE_URI: joi
      .string()
      .uri()
      .required(),
    KEY_VAULTS_URI: joi
      .string()
      .uri()
      .required(),
    IMAGE_LINK: joi
      .string()
      .uri()
      .required(),
    STORAGE_ACCOUNT: joi.string().required(),
    AZURE_HOST: joi
      .string()
      .uri()
      .required(),
    PAYMENT_SECRET: joi.string().required(),
    PAYMENT_MERCHANT_ID: joi.number().required(),
    NOVA_POSHTA_API_LINK: joi
      .string()
      .uri()
      .required(),
    NOVA_POSHTA_API_KEY: joi.string().required(),
    PAYMENT_API_LINK: joi
      .string()
      .uri()
      .required(),
    MAIL_USER: joi
      .string()
      .email()
      .required(),
    RECOVERY_EXPIRE: joi.string().required(),
    FRONT_BASE_URI: joi
      .string()
      .uri()
      .required(),
    TEST_BASE_URI: joi
      .string()
      .uri()
      .required(),
    SUPER_ADMIN_EMAIL: joi
      .string()
      .email()
      .required(),
    SUPER_ADMIN_PASSWORD: joi.string().required(),
    CURRENCY_API_URL: joi
      .string()
      .uri()
      .required(),
    CONFIRMATION_SECRET: joi.string().required(),
    SENDGRID_API_KEY: joi.string().required(),
  });

  const environment = envSchema.validate(processEnv, { allowUnknown: true });

  if (environment.error) throw environment.error;

  return { ...environment.value };
}

dotenvValidator(process.env);
module.exports = { ...process.env, dotenvVariables };
