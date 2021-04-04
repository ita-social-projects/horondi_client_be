const Joi = require('joi');

const {
  SIDES: { LEFT, RIGHT, BACK, FRONT },
} = require('../consts/side-names');

const nestedSideValidator = Joi.string()
  .trim()
  .valid(RIGHT, LEFT, FRONT, BACK)
  .required();

const nestedPriceValidator = Joi.object({
  currency: Joi.string()
    .trim()
    .required(),
  value: Joi.number()
    .optional()
    .default(0),
});

const pocketValidator = Joi.object({
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.Object({
    side: nestedSideValidator,
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array().has(nestedPriceValidator),
  available: Joi.boolean(),
  default: Joi.boolean().required(),
});

const backValidator = Joi.object({
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const closureValidator = Joi.object({
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const strapValidator = Joi.object({
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.object({
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

module.exports = {
  pocketValidator,
  backValidator,
  closureValidator,
  strapValidator,
};
// const appliedOption = {
//   type: 'POCKET',
//   features: [
//     {
//       type: 'SIDE',
//       side: 'LEFT'
//     },
//     {
//       type: 'SIDE',
//       side: 'RIGHT'
//     }
//   ],
//   isDefault: true,
//   modelId: modelId
// };

// const pocketScheme = {
//   type: 'POCKET',
//   features: ['SIDE'],
//   isDefault: '',
//   modelId: ''
// };

// const bottomScheme = {
//   type: 'BOTTOM',
//   features: ['MATERIAL', 'COLOR'],
//   isDefault: 'Boolean',
//   modelId: ''
// };

// const jsonPocketScheme = {
//   "title": "Pocket",
//   "type": "object",
//   "properties": {
//     "type": {
//       "type": "string"
//     },
//     "isDefault": {
//       "type": "bool"
//     },
//     "modelId": {
//       "type": "string"
//     },
//     "features": {
//       "type": "array",
//       "items": { "$ref": "#/$defs/feature" }
//     }
//   },
//   "$defs": {
//     "feature": {
//       "type": "object",
//       "required": ["side"],
//       "properties": {
//         "side": {
//           "type": "string",
//           "enum": ['LEFT', 'RIGHT', 'FRONT']
//         }
//       }
//     }
//   }
// };

// const closureScheme = {
//   "title": "Pocket",
//   "type": "object",
//   "properties": {
//     "type": {
//       "type": "string"
//     },
//     "isDefault": {
//       "type": "bool"
//     },
//     "modelId": {
//       "type": "string"
//     },
//     "features": {
//       "type": "array",
//       "items": { "$ref": "#/$defs/feature" },
//     }
//   },
//   "$defs": {
//     "feature": {
//       "type": "object",
//       "required": ["material", "color"],
//       "properties": {
//         "material": {
//           "type": "object",
//         },
//         "color": {
//           "type": "object",
//         }
//       }
//     }
//   }
// };

// const smujka = {
//   "title": "Pocket",
//   "type": "object",
//   "properties": {
//     "type": {
//       "type": "string"
//     },
//     "isDefault": {
//       "type": "bool"
//     },
//     "modelId": {
//       "type": "string"
//     },
//     "features": {
//       "type": "array",
//       "items": { "$ref": "#/$defs/feature" },
//     }
//   },
//   "$defs": {
//     "feature": {
//       "type": "object",
//       "required": ["color"],
//       "properties": {
//         "color": {
//           "type": "object",
//         }
//       }
//     }
//   }
// };
