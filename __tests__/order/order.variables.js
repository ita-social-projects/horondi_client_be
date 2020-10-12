const newOrder = {
  status: 'DELIVERED',
  user: {
    firstName: 'Test',
    lastName: 'Test',
    patronymicName: 'Test',
    email: 'test@gmail.com',
    phoneNumber: '380953544271',
  },
  address: {
    country: 'Україна',
    region: 'Кіровоградська область',
    city: 'Новомиргород',
    zipcode: '98908',
    street: 'Бульвар Марії Приймаченко',
    buildingNumber: '25',
    appartment: '97',
  },
  delivery: {
    sentBy: 'Nova Poshta',
    byCourier: true,
    courierOffice: 10,
    invoiceNumber: '6280260',
    cost: [
      {
        currency: 'UAH',
        value: 7000,
      },
      {
        currency: 'USD',
        value: 240,
      },
    ],
  },
  items: [
    {
      category: [
        {
          lang: 'uk',
          value: 'Сумки',
        },
        {
          lang: 'en',
          value: 'Bags',
        },
      ],
      subcategory: [
        {
          lang: 'uk',
          value: 'Сумки',
        },
        {
          lang: 'en',
          value: 'Bags',
        },
      ],
      model: [
        {
          lang: 'uk',
          value: 'Сумка з гобеленом',
        },
        {
          lang: 'en',
          value: 'Bag with a Pattern',
        },
      ],
      name: [
        {
          lang: 'uk',
          value: 'Сумка з гобеленом синя',
        },
        {
          lang: 'en',
          value: 'Bag with a Pattern Blue',
        },
      ],
      colors: [
        [
          {
            lang: 'uk',
            value: 'Сталево-блакитний',
          },
          {
            lang: 'en',
            value: 'Steel-blue',
          },
        ],
      ],
      pattern: [
        {
          lang: 'uk',
          value: 'Олені',
        },
        {
          lang: 'en',
          value: 'Deers',
        },
      ],
      closure: [],
      closureColor: '',
      size: {
        heightInCm: 38,
        widthInCm: 36,
        depthInCm: 10,
        volumeInLiters: 0,
        weightInKg: 0,
      },
      bottomMaterial: [
        {
          lang: 'uk',
          value: 'Тканина Кордура',
        },
        {
          lang: 'en',
          value: 'Cordura fabric',
        },
      ],
      bottomColor: [
        {
          lang: 'uk',
          value: 'чорний',
        },
        {
          lang: 'en',
          value: 'black',
        },
      ],
      additions: [],
      actualPrice: [
        {
          currency: 'UAH',
          value: 90000,
        },
        {
          currency: 'USD',
          value: 3246,
        },
      ],
      quantity: 1,
    },
  ],
  paymentMethod: 'CARD',
};

const newOrderMutation = {
  ...newOrder,
  status: 'SENT',
};

const updatedData = {
  user: {
    firstName: 'Updated',
    lastName: 'Updated',
    patronymicName: 'Updated',
    email: 'test.updated@gmail.com',
    phoneNumber: '380953544271',
  },
};
const queryPattern = {
  user: {
    email: 'test@gmail.com',
    lastName: 'Test',
    firstName: 'Test',
    phoneNumber: '380953544271',
    patronymicName: 'Test',
  },
  delivery: {
    sentOn: null,
    sentBy: 'Nova Poshta',
    byCourier: true,
    invoiceNumber: '6280260',
    courierOffice: 10,
  },
  isPaid: false,
  status: 'DELIVERED',
  address: {
    appartment: '97',
    buildingNumber: '25',
    region: 'Кіровоградська область',
    street: 'Бульвар Марії Приймаченко',
    city: 'Новомиргород',
    country: 'Україна',
    zipcode: '98908',
  },
  completed: false,
  userComment: '',
  cancellationReason: '',
  adminComment: '',
  items: [
    {
      category: [
        {
          lang: 'uk',
          value: 'Сумки',
        },
        {
          lang: 'en',
          value: 'Bags',
        },
      ],
      subcategory: [
        {
          lang: 'uk',
          value: 'Сумки',
        },
        {
          lang: 'en',
          value: 'Bags',
        },
      ],
      model: [
        {
          lang: 'uk',
          value: 'Сумка з гобеленом',
        },
        {
          lang: 'en',
          value: 'Bag with a Pattern',
        },
      ],
      name: [
        {
          lang: 'uk',
          value: 'Сумка з гобеленом синя',
        },
        {
          lang: 'en',
          value: 'Bag with a Pattern Blue',
        },
      ],
      colors: [
        [
          {
            lang: 'uk',
            value: 'Сталево-блакитний',
          },
          {
            lang: 'en',
            value: 'Steel-blue',
          },
        ],
      ],
      pattern: [
        {
          lang: 'uk',
          value: 'Олені',
        },
        {
          lang: 'en',
          value: 'Deers',
        },
      ],
      closure: [],
      closureColor: '',
      size: {
        heightInCm: 38,
        widthInCm: 36,
        depthInCm: 10,
        volumeInLiters: 0,
        weightInKg: 0,
      },
      bottomMaterial: [
        {
          lang: 'uk',
          value: 'Тканина Кордура',
        },
        {
          lang: 'en',
          value: 'Cordura fabric',
        },
      ],
      bottomColor: [
        {
          lang: 'uk',
          value: 'чорний',
        },
        {
          lang: 'en',
          value: 'black',
        },
      ],
      additions: [],
      actualPrice: [
        {
          currency: 'UAH',
          value: 90000,
        },
        {
          currency: 'USD',
          value: 3246,
        },
      ],
      quantity: 1,
    },
  ],
  totalItemsPrice: [
    { currency: 'UAH', value: 90000 },
    { currency: 'USD', value: 3246 },
  ],
  totalPriceToPay: [
    { currency: 'UAH', value: 97000 },
    { currency: 'USD', value: 3486 },
  ],
  paymentMethod: 'CARD',
};
const userOrder = {
  firstName: 'Test',
  lastName: 'Test',
  patronymicName: 'Test',
  email: 'test@gmail.com',
  phoneNumber: '380953544271',
};

const adressOrder = {
  country: 'Україна',
  region: 'Кіровоградська область',
  city: 'Новомиргород',
  zipcode: '98908',
  street: 'Бульвар Марії Приймаченко',
  buildingNumber: '25',
  appartment: '97',
};
const deliveryOrder = {
  sentBy: 'Nova Poshta',
  byCourier: true,
  courierOffice: 10,
  invoiceNumber: '6280260',
  sentOn: null,
};
const itemsOrder = [
  {
    category: [
      {
        lang: 'uk',
        value: 'Сумки',
      },
      {
        lang: 'en',
        value: 'Bags',
      },
    ],
    subcategory: [
      {
        lang: 'uk',
        value: 'Сумки',
      },
      {
        lang: 'en',
        value: 'Bags',
      },
    ],
    model: [
      {
        lang: 'uk',
        value: 'Сумка з гобеленом',
      },
      {
        lang: 'en',
        value: 'Bag with a Pattern',
      },
    ],
    name: [
      {
        lang: 'uk',
        value: 'Сумка з гобеленом синя',
      },
      {
        lang: 'en',
        value: 'Bag with a Pattern Blue',
      },
    ],
    colors: [
      [
        {
          lang: 'uk',
          value: 'Сталево-блакитний',
        },
        {
          lang: 'en',
          value: 'Steel-blue',
        },
      ],
    ],
    pattern: [
      {
        lang: 'uk',
        value: 'Олені',
      },
      {
        lang: 'en',
        value: 'Deers',
      },
    ],
    closure: [],
    closureColor: '',
    size: {
      heightInCm: 38,
      widthInCm: 36,
      depthInCm: 10,
      volumeInLiters: 0,
      weightInKg: 0,
    },
    bottomMaterial: [
      {
        lang: 'uk',
        value: 'Тканина Кордура',
      },
      {
        lang: 'en',
        value: 'Cordura fabric',
      },
    ],
    bottomColor: [
      {
        lang: 'uk',
        value: 'чорний',
      },
      {
        lang: 'en',
        value: 'black',
      },
    ],
    additions: [],
    actualPrice: [
      {
        currency: 'UAH',
        value: 90000,
      },
      {
        currency: 'USD',
        value: 3246,
      },
    ],
    quantity: 1,
  },
];

const newOrderUpdated = {
  ...newOrderMutation,
  ...updatedData,
};

module.exports = {
  newOrder,
  newOrderUpdated,
  newOrderMutation,
  queryPattern,
  userOrder,
  adressOrder,
  deliveryOrder,
  itemsOrder,
};
