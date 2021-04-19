const ObjectId = require('mongodb').ObjectID;

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
  model: '6043bf9e3e06ad3edcdb7b30',
  features: {
    material: '6043c2d13e06ad3edcdb7b33',
    color: '6043a9cc3e06ad3edcdb7b0e',
  },
  image: 'small_id73cf0klxzut8v_гобелен-7.png',
  default: true,
};

const patternExtraFields = {
  optionType: 'PATTERN',
  model: '6043bf9e3e06ad3edcdb7b30',
  features: {
    material: '6043b2ec3e06ad3edcdb7b17',
    handmade: false,
  },
  default: true,
};

const constructorBasicExtraFields = {
  optionType: 'CONSTRUCTOR_BASIC',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043a1f33e06ad3edcdb7b09'),
    color: ObjectId('6043a1653e06ad3edcdb7b08'),
  },
  default: false,
};

const constructorBottomExtraFields = {
  optionType: 'CONSTRUCTOR_BOTTOM',
  model: ObjectId('6043bf9e3e06ad3edcdb7b30'),
  features: {
    material: ObjectId('6043aaab3e06ad3edcdb7b11'),
    color: ObjectId('6043a9cc3e06ad3edcdb7b0e'),
  },
  default: false,
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
    constructorFrontPocket: [],
    constructorBottom: [
      ObjectId('604e3385b17ecf65048afd71'),
      ObjectId('604e33a0b17ecf65048afd72'),
      ObjectId('604e33bcb17ecf65048afd73'),
    ],
    constructorPocket: [ObjectId('60796dc9a7ed703b609f2752')],
    constructorBack: [ObjectId('6079a024034de634b8c3d9d4')],
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
  restrictions: [
    ObjectId('60745ee1bbe56534c851ea1f'),
    ObjectId('60797c0c8982222408148480'),
  ],
};

module.exports = {
  sizeName,
  banned,
  closureExtraFields,
  patternExtraFields,
  constructorBasicExtraFields,
  constructorBottomExtraFields,
  constructorFrontPocketExtraFields,
  modelRefactoredFields,
};
