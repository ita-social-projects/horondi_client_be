const Joi = require('joi');

const {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  SENT_BY,
  EMPTY_STRING,
} = require('../consts/order-details');
const { userNameRegExp, numberRegExp } = require('../consts/regexp');
const { DELIVERY_TYPE } = require('../consts/delivery-type');

const {
  ORDER_CREATED,
  CONFIRMED,
  PRODUCED,
  CANCELLED,
  REFUNDED,
  SENT,
  DELIVERED,
} = ORDER_STATUSES;

const { CARD, CASH } = PAYMENT_METHODS;

const {
  CREATED,
  EXPIRED,
  APPROVED,
  DECLINED,
  REVERSED,
  PROCESSING,
  PAID,
} = PAYMENT_STATUSES;

const {
  NOVAPOST,
  UKRPOST,
  SELFPICKUP,
  NOVAPOSTCOURIER,
  UKRPOSTCOURIER,
} = DELIVERY_TYPE;

const deliveryCheckerValidator = Joi.string()
  .when(SENT_BY, {
    is: NOVAPOSTCOURIER,
    then: Joi.string().required(),
  })
  .when(SENT_BY, {
    is: UKRPOSTCOURIER,
    then: Joi.string().required(),
    otherwise: Joi.string().only(EMPTY_STRING),
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
  sentOn: Joi.string().allow(EMPTY_STRING),
  sentBy: Joi.string()
    .trim()
    .valid(NOVAPOST, UKRPOST, SELFPICKUP, NOVAPOSTCOURIER, UKRPOSTCOURIER)
    .required(),
  invoiceNumber: Joi.string().allow(EMPTY_STRING),
  courierOffice: Joi.string()
    .when(SENT_BY, {
      is: NOVAPOST,
      then: Joi.string().required(),
    })
    .when(SENT_BY, {
      is: UKRPOST,
      then: Joi.string().required(),
      otherwise: Joi.string().only(EMPTY_STRING),
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
      otherwise: Joi.string().only(EMPTY_STRING),
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
    sidePocket: Joi.boolean().required(),
  }),
  fixedPrice: Joi.array().has(nestedCostValidator),
});

const orderValidator = Joi.object({
  status: Joi.string()
    .trim()
    .valid(
      ORDER_CREATED,
      CONFIRMED,
      PRODUCED,
      CANCELLED,
      REFUNDED,
      SENT,
      DELIVERED
    )
    .required(),
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
    .allow(EMPTY_STRING),
  isPaid: Joi.boolean().required(),
  paymentStatus: Joi.string().valid(
    CREATED,
    EXPIRED,
    APPROVED,
    DECLINED,
    REVERSED,
    PROCESSING,
    PAID
  ),
});

module.exports = { orderValidator };
