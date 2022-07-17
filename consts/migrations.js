const { ObjectId } = require('mongoose').Types;

const {
  ADDITIONAL_PRICE_TYPES: { ABSOLUTE_INDICATOR },
} = require('./additional-price-types');
const {
  CURRENCY: { UAH, USD },
} = require('./currency');

const sizeName = {
  simpleName: [
    {
      lang: 'ua',
      value: 'Назва розміру',
    },
    {
      lang: 'en',
      value: 'Sizes name',
    },
  ],
};

const banned = {
  banned: {
    blockPeriod: '0',
    blockCount: 0,
  },
};

const closureExtraFields = {
  optionType: 'CLOSURE',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043c2d13e06ad3edcdb7b33'),
    color: ObjectId('6043a9cc3e06ad3edcdb7b0e'),
  },
  image: 'small_id73cf0klxzut8v_гобелен-7.png',
  customizable: true,
};

const patternExtraFields = {
  optionType: 'PATTERN',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043b2ec3e06ad3edcdb7b17'),
    handmade: false,
  },
  customizable: true,
};

const constructorBasicOneExtraFields = {
  optionType: 'CONSTRUCTOR_BASIC',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043a1f33e06ad3edcdb7b09'),
    color: ObjectId('6043a1653e06ad3edcdb7b08'),
  },
  customizable: true,
};

const constructorBasicTwoExtraFields = {
  optionType: 'CONSTRUCTOR_BASIC',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043a1f33e06ad3edcdb7b09'),
    color: ObjectId('6043a9bb3e06ad3edcdb7b0d'),
  },
  customizable: true,
};

const constructorBasicThreeExtraFields = {
  optionType: 'CONSTRUCTOR_BASIC',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043a1f33e06ad3edcdb7b09'),
    color: ObjectId('6043a1653e06ad3edcdb7b08'),
  },
  customizable: true,
};

const constructorBottomOneExtraFields = {
  optionType: 'CONSTRUCTOR_BOTTOM',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043ac5d3e06ad3edcdb7b13'),
    color: ObjectId('6043aa9c3e06ad3edcdb7b10'),
  },
  customizable: true,
};

const constructorBottomTwoExtraFields = {
  optionType: 'CONSTRUCTOR_BOTTOM',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043ac5d3e06ad3edcdb7b13'),
    color: ObjectId('6043a9cc3e06ad3edcdb7b0e'),
  },
  customizable: true,
};

const constructorBottomThreeExtraFields = {
  optionType: 'CONSTRUCTOR_BOTTOM',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043aaab3e06ad3edcdb7b11'),
    color: ObjectId('6043a9cc3e06ad3edcdb7b0e'),
  },
  customizable: true,
};

const constructorFrontPocketExtraFields = {
  optionType: 'CONSTRUCTOR_FRONT_POCKET',
  model: ObjectId('6043c1223e06ad3edcdb7b31'),
  features: {
    material: ObjectId('6043ab033e06ad3edcdb7b12'),
    color: ObjectId('6043a9cc3e06ad3edcdb7b0e'),
  },
};

const modelRefactoredFields = {
  eligibleOptions: {
    constructorBasic: [
      ObjectId('604e329bb17ecf65048afd6c'),
      ObjectId('604e32fdb17ecf65048afd6d'),
      ObjectId('604e3319b17ecf65048afd6e'),
    ],
    constructorPattern: [
      ObjectId('6043b87c3e06ad3edcdb7b19'),
      ObjectId('6043b8c53e06ad3edcdb7b1a'),
      ObjectId('6043b90d3e06ad3edcdb7b1b'),
      ObjectId('6043b9723e06ad3edcdb7b1c'),
      ObjectId('6043b9f73e06ad3edcdb7b1d'),
      ObjectId('6043ba373e06ad3edcdb7b1e'),
    ],
    constructorFrontPocket: [ObjectId('604e3341b17ecf65048afd6f')],
    constructorBottom: [
      ObjectId('604e3385b17ecf65048afd71'),
      ObjectId('604e33a0b17ecf65048afd72'),
      ObjectId('604e33bcb17ecf65048afd73'),
    ],
    constructorPocket: [],
    constructorBack: [],
    constructorClosure: [ObjectId('6043c8acc60c2e4b940189ae')],
    constructorStrap: [],
  },
  appliedOptions: {
    constructorBasic: '',
    constructorPattern: '',
    constructorBottom: '',
    constructorPocket: [],
    constructorBack: '',
    constructorClosure: '',
    constructorStrap: '',
  },
  restrictions: [],
};

const slug = { slug: '' };

const additionalPrice = {
  additionalPrice: [
    {
      value: 0,
      type: ABSOLUTE_INDICATOR,
      currency: UAH,
    },
    {
      value: 0,
      type: ABSOLUTE_INDICATOR,
      currency: USD,
    },
  ],
};

const modelSize = {
  _id: ObjectId(),
  name: 'M',
  heightInCm: 20,
  widthInCm: 20,
  depthInCm: 14,
  volumeInLiters: 20,
  weightInKg: 1,
  available: true,
  __v: 377,
  absolutePrice: 20,
  relativePrice: null,
};

const sizes = {
  sizes: [
    {
      size: ObjectId('60439516a7532c33dcb326d7'),
      price: [
        {
          value: 0,
          currency: UAH,
        },
        {
          value: 0,
          currency: USD,
        },
      ],
    },
  ],
};
const user_id = { user_id: null };
const link = {
  link: {
    _id: ObjectId('616b25d6c89d78404c04d86d'),
    lat: '49.8546374',
    lon: '24.0322823',
  },
};

module.exports = {
  sizeName,
  banned,
  slug,
  closureExtraFields,
  patternExtraFields,
  constructorBasicOneExtraFields,
  constructorBasicTwoExtraFields,
  constructorBasicThreeExtraFields,
  constructorBottomOneExtraFields,
  constructorBottomTwoExtraFields,
  constructorBottomThreeExtraFields,
  constructorFrontPocketExtraFields,
  modelRefactoredFields,
  additionalPrice,
  sizes,
  modelSize,
  user_id,
  link,
};
