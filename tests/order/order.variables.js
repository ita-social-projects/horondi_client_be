const wrongId = '5fb412d8663cf10bec9faa1a';
const getOrdersByUserInput = {
  filter: {
    date: { dateFrom: '', dateTo: '' },
    paymentStatus: [],
    search: '',
    status: [],
  },
  sort: { dateOfCreation: -1 },
};
const newOrderInputData = (
  productId,
  modelId,
  sizeId,
  constructorId,
  userId
) => ({
  status: 'CREATED',
  recipient: {
    firstName: 'Arsen',
    lastName: 'Wenger',
    email: 'test@gmail.com',
    phoneNumber: '380950000000',
  },
  userComment: 'The bag is pretty good',
  delivery: {
    byCourier: true,
    courierOffice: '',
    invoiceNumber: '6280260',
    sentBy: 'SELFPICKUP',
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
      product: productId,
      model: modelId,
      quantity: 2,
      isFromConstructor: false,
      constructorBasics: constructorId,
      options: {
        size: sizeId,
      },
      fixedPrice: [
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
  ],
  paymentMethod: 'CASH',
  paymentStatus: 'CREATED',
  user_id: userId,
});
const newOrderUpdated = (productId, modelId, sizeId, constructorId) => ({
  status: 'SENT',
  recipient: {
    firstName: 'Updated',
    lastName: 'Updated',
    email: 'test.updated@gmail.com',
    phoneNumber: '380953544271',
  },
  userComment: 'Updated',
  delivery: {
    byCourier: true,
    courierOffice: '',
    invoiceNumber: '6280260',
    sentBy: 'SELFPICKUP',
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
      product: productId,
      model: modelId,
      quantity: 2,
      isFromConstructor: false,
      constructorBasics: constructorId,
      options: {
        size: sizeId,
      },
      fixedPrice: [
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
  ],
  paymentMethod: 'CASH',
  paymentStatus: 'APPROVED',
});

module.exports = {
  newOrderInputData,
  getOrdersByUserInput,
  wrongId,
  newOrderUpdated,
};
