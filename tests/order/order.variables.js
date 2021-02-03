const wrongId = '5fb412d8663cf10bec9faa1a';
const newOrderInputData = (productId, modelId, sizeId, constructorId) => ({
  status: 'CREATED',
  user: {
    firstName: 'Arsen',
    lastName: 'Wenger',
    patronymicName: 'Test',
    email: 'test@gmail.com',
    phoneNumber: '380950000000',
  },
  userComment: 'The bag is pretty good',
  delivery: {
    byCourier: true,
    courierOffice: 10,
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
  paymentStatus: 'CREATED',
});
const newOrderUpdated = (productId, modelId, sizeId, constructorId) => ({
  status: 'SENT',
  user: {
    firstName: 'Updated',
    lastName: 'Updated',
    patronymicName: 'Updated',
    email: 'test.updated@gmail.com',
    phoneNumber: '380953544271',
  },
  userComment: 'Updated',
  delivery: {
    byCourier: true,
    courierOffice: 10,
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
  paymentStatus: 'APPROVED',
});

module.exports = {
  newOrderInputData,
  wrongId,
  newOrderUpdated,
};
