const { body, validationResult } = require('express-validator');

const userValidationRules = () => [
  body('email', 'Email is required').isEmail(),
  body('password').isLength({ min: 6 }),
];

const userLoginValidationRules = () => [
  body('email', 'Email is required').isEmail(),
  body('password').isLength({ min: 6 }),
];

const catalogValidationRules = () => [
  body('catalog', 'catalog name is required')
    .notEmpty()
    .isString(),
];

const categoryValidationRules = () => [
  body('category', 'category name is required')
    .notEmpty()
    .isString(),
];

const brandValidationRules = () => [
  body('brand', 'brand name is required')
    .notEmpty()
    .isString(),
];

const colorValidationRules = () => [
  body('color', 'color name is required')
    .notEmpty()
    .isString(),
];

const propetriesValidationRules = () => [
  body('size', 'Size is required')
    .notEmpty()
    .isString(),
  body('available', 'Available is required')
    .notEmpty()
    .isNumeric(),
  body('sku', 'sku is required')
    .notEmpty()
    .isString(),
];

const productValidationRules = () => [
  body('title', 'title is required')
    .notEmpty()
    .isString(),
  body('description', 'description is required')
    .notEmpty()
    .isString(),
  body('price', 'Price is required')
    .notEmpty()
    .isNumeric({ min: 1, max: 10000 }),
];

const orderValidationRules = () => [
  body(
    'deliveryType',
    'deliveryType is required and has to be one of:"currier","post","delivery service"',
  )
    .notEmpty()
    .isString(),
  body(
    'paymentMethod',
    'paymentMethod is required and has to be one of: credit Card,Pay Pal,Cash,Google pay,Amazon Pay,Apple Pay',
  )
    .notEmpty()
    .isString(),
  body('contactPhone', 'contactPhone is required')
    .notEmpty()
    .isNumeric(),
];
const cartValidationRules = () => [
  body('userId', 'userId of product is required')
    .notEmpty()
    .isString(),
];
const newsValidationRules = () => [
  body('title', 'title is required')
    .notEmpty()
    .isString(),
  body('text', 'text is required')
    .notEmpty()
    .isString(),
  body('newsImage', 'newsImage is required')
    .notEmpty()
    .isString(),
  body('author', 'author is required')
    .notEmpty()
    .isString(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  userValidationRules,
  catalogValidationRules,
  propetriesValidationRules,
  productValidationRules,
  userLoginValidationRules,
  brandValidationRules,
  colorValidationRules,
  categoryValidationRules,
  orderValidationRules,
  cartValidationRules,
  newsValidationRules,
  validate,
};
