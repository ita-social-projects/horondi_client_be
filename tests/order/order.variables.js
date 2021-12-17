const wrongId = '5fb412d8663cf10bec9faa1a';
const orderStatus = 'CREATED';
const paymentStatus = 'CREATED';
const price = [
  {
    currency: 'UAH',
    value: 50,
  },
  {
    currency: 'USD',
    value: 2,
  },
];
const getOrdersInput = {
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
  userId,
) => ({
  status: orderStatus,
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
    cost: price,
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
      fixedPrice: price,
      price,
    },
  ],
  paymentMethod: 'CASH',
  paymentStatus,
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
    cost: price,
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
      fixedPrice: price,
      price,
    },
  ],
  paymentMethod: 'CASH',
  paymentStatus: 'APPROVED',
});

module.exports = {
  newOrderInputData,
  getOrdersInput,
  wrongId,
  newOrderUpdated,
  orderStatus,
  paymentStatus,
};
