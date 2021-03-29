const Joi = require('joi');

const {
  ORDER_STATUSES: {
    CREATED,
    CONFIRMED,
    PRODUCED,
    CANCELLED,
    REFUNDED,
    SENT,
    DELIVERED,
  },
} = require('../consts/order-statuses');
const { SENT_BY } = require('../consts/order-details');
const {
  PAYMENT_STATUSES: {
    PAYMNET_CREATED,
    PAYMENT_EXPIRED,
    PAYMENT_APPROVED,
    PAYMENT_DECLINED,
    PAYMENT_REVERSED,
    PAYMENT_PROCESSING,
    PAYMENT_PAID,
  },
} = require('../consts/payment-statuses');
const {
  PAYMENT_TYPES: { CARD, CASH },
} = require('../consts/payment-types');
const { userNameRegExp, numberRegExp } = require('../consts/regexp');
const {
  DELIVERY_TYPE: {
    NOVAPOST,
    UKRPOST,
    SELFPICKUP,
    NOVAPOSTCOURIER,
    UKRPOSTCOURIER,
  },
} = require('../consts/delivery-type');

const deliveryCheckerValidator = Joi.string()
  .when(SENT_BY, {
    is: NOVAPOSTCOURIER,
    then: Joi.string().required(),
  })
  .when(SENT_BY, {
    is: UKRPOSTCOURIER,
    then: Joi.string().required(),
    otherwise: Joi.string().only(''),
  });

const nestedUserValidator = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .regex(userNameRegExp),
  lastName: Joi.string()
    .trim()
    .required()
    .regex(userNameRegExp),
  email: Joi.string()
    .trim()
    .required()
    .email(),
  phoneNumber: Joi.string()
    .trim()
    .required()
    .regex(numberRegExp),
});

const nestedDeliveryValidator = Joi.object({
  sentOn: Joi.string().allow(''),
  sentBy: Joi.string()
    .trim()
    .valid(NOVAPOST, UKRPOST, SELFPICKUP, NOVAPOSTCOURIER, UKRPOSTCOURIER)
    .required(),
  invoiceNumber: Joi.string().allow(''),
  courierOffice: Joi.string()
    .when(SENT_BY, {
      is: NOVAPOST,
      then: Joi.string().required(),
    })
    .when(SENT_BY, {
      is: UKRPOST,
      then: Joi.string().required(),
      otherwise: Joi.string().only(''),
    }),
  region: Joi.string().when(SENT_BY, {
    is: UKRPOST,
    then: Joi.string().required(),
  }),
  district: Joi.string().when(SENT_BY, {
    is: UKRPOST,
    then: Joi.string().required(),
  }),
  city: Joi.string()
    .when(SENT_BY, {
      is: NOVAPOSTCOURIER,
      then: Joi.string().required(),
    })
    .when(SENT_BY, {
      is: UKRPOSTCOURIER,
      then: Joi.string().required(),
    })
    .when(SENT_BY, {
      is: UKRPOST,
      then: Joi.string().required(),
    })
    .when(SENT_BY, {
      is: NOVAPOST,
      then: Joi.string().required(),
      otherwise: Joi.string().only(''),
    }),
  street: deliveryCheckerValidator,
  house: deliveryCheckerValidator,
  flat: deliveryCheckerValidator,
  byCourier: Joi.boolean().required(),
  cost: Joi.array().has({
    currency: Joi.string()
      .trim()
      .required(),
    value: Joi.number().required(),
  }),
});

const nestedCostValidator = Joi.object({
  currency: Joi.string()
    .trim()
    .required(),
  value: Joi.number().required(),
});

const nestedItemValidator = Joi.object({
  product: Joi.string().required(),
  model: Joi.string().optional(),
  constructorBasics: Joi.string().optional(),
  constructorBottom: Joi.string().optional(),
  constructorFrontPocket: Joi.string().optional(),
  constructorPattern: Joi.string().optional(),
  actualPrice: Joi.array()
    .has(nestedCostValidator)
    .optional(),
  quantity: Joi.number().required(),
  isFromConstructor: Joi.boolean().required(),
  options: Joi.object({
    size: Joi.string().required(),
    sidePocket: Joi.boolean(),
  }),
  fixedPrice: Joi.array()
    .has(nestedCostValidator)
    .optional(),
});

const orderValidator = Joi.object({
  status: Joi.string()
    .trim()
    .valid(
      CREATED,
      CONFIRMED,
      PRODUCED,
      CANCELLED,
      REFUNDED,
      SENT,
      DELIVERED,
      null
    ),
  user: nestedUserValidator,
  delivery: nestedDeliveryValidator,
  items: Joi.array().has(nestedItemValidator),
  paymentMethod: Joi.string()
    .trim()
    .valid(CARD, CASH)
    .required(),
  userComment: Joi.string()
    .min(2)
    .max(500)
    .allow(''),
  isPaid: Joi.boolean(),
  paymentStatus: Joi.string().valid(
    PAYMNET_CREATED,
    PAYMENT_EXPIRED,
    PAYMENT_APPROVED,
    PAYMENT_DECLINED,
    PAYMENT_REVERSED,
    PAYMENT_PROCESSING,
    PAYMENT_PAID
  ),
});

const getAllOrdersValidator = {
  limitValidator: Joi.number(),
  skipValidator: Joi.number(),
};

const getOrdersStatisticValidator = Joi.number().required();

module.exports = {
  orderValidator,
  getAllOrdersValidator,
  getOrdersStatisticValidator,
};
