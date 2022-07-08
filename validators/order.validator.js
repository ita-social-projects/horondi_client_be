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
    PAYMENT_CREATED,
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
const {
  userNameRegExp,
  numberRegExp,
  onlyNumbersRegExp,
} = require('../consts/regexp');
const {
  DELIVERY_TYPE: {
    NOVAPOST,
    UKRPOST,
    SELFPICKUP,
    NOVAPOSTCOURIER,
    UKRPOSTCOURIER,
    WORLDWIDE,
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
  firstName: Joi.string().trim().required().regex(userNameRegExp),
  lastName: Joi.string().trim().required().regex(userNameRegExp),
  email: Joi.string().trim().required().email(),
  phoneNumber: Joi.string().trim().required().regex(numberRegExp),
});

const nestedDeliveryValidator = Joi.object({
  sentOn: Joi.string().allow(''),
  sentBy: Joi.string()
    .trim()
    .valid(
      NOVAPOST,
      UKRPOST,
      SELFPICKUP,
      NOVAPOSTCOURIER,
      UKRPOSTCOURIER,
      WORLDWIDE
    )
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
  region: Joi.string()
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
      otherwise: Joi.string().only(''),
    }),
  regionId: Joi.string().allow('').when(SENT_BY, {
    is: UKRPOST,
    then: Joi.string().required(),
  }),
  district: Joi.string()
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
      otherwise: Joi.string().only(''),
    }),
  districtId: Joi.string().allow('').when(SENT_BY, {
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
  cityId: Joi.string().allow('').when(SENT_BY, {
    is: UKRPOST,
    then: Joi.string().required(),
  }),
  street: deliveryCheckerValidator,
  house: deliveryCheckerValidator,
  flat: Joi.string()
    .when(SENT_BY, {
      is: NOVAPOSTCOURIER,
      then: Joi.string().allow(null, '').optional(),
    })
    .when(SENT_BY, {
      is: UKRPOSTCOURIER,
      then: Joi.string().allow(null, '').optional(),
      otherwise: Joi.string().only(''),
    }),
  byCourier: Joi.boolean().required(),
  messenger: Joi.string().allow('').when(SENT_BY, {
    is: WORLDWIDE,
    then: Joi.string().required(),
  }),
  messengerPhone: Joi.string()
    .allow('')
    .when(SENT_BY, {
      is: WORLDWIDE,
      then: Joi.string().required().regex(numberRegExp),
    }),
  worldWideCountry: Joi.string().allow('').when(SENT_BY, {
    is: WORLDWIDE,
    then: Joi.string().required(),
  }),
  stateOrProvince: Joi.string().allow(null, '').optional(),
  worldWideCity: Joi.string().allow('').when(SENT_BY, {
    is: WORLDWIDE,
    then: Joi.string().required(),
  }),
  worldWideStreet: Joi.string().allow('').when(SENT_BY, {
    is: WORLDWIDE,
    then: Joi.string().required(),
  }),
  cityCode: Joi.string()
    .allow('')
    .when(SENT_BY, {
      is: WORLDWIDE,
      then: Joi.string().required().regex(onlyNumbersRegExp),
    }),

  cost: Joi.number(),
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
  recipient: nestedUserValidator,
  delivery: nestedDeliveryValidator,
  items: Joi.array(),
  user_id: Joi.string().empty(null),
  paymentMethod: Joi.string().trim().valid(CARD, CASH).required(),
  userComment: Joi.string().min(2).max(500).allow(''),
  promoCodeId: Joi.string().allow(''),
  isPaid: Joi.boolean(),
  paymentStatus: Joi.string().valid(
    PAYMENT_CREATED,
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
