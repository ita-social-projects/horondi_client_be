const joi = require('@hapi/joi');
require('dotenv').config();

const envSchema = joi.object({
  PAYMENT_MERCHANT_ID: joi.number().required(),
  MONGO_URL: joi.string().required(),
});

const environment = envSchema.validate({
  ...process.env,
});

if (environment.error) throw environment.error;
