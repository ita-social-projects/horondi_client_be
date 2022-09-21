const wrongId = '5fb412d8663cf10bec9faa1a';
const email = 'test@test.com';
const orderStatus = 'CREATED';
const paymentStatus = 'CREATED';
const price = 2;
const getOrdersInput = {
  filter: {
    date: { dateFrom: '', dateTo: '' },
    paymentStatus: [],
    search: '',
    status: [],
  },
  sort: { dateOfCreation: -1 },
};

const newCertificateInputData = [
  {
    value: 1000,
    count: 1,
  },
];

const newOrderInputData = (
  productId,
  modelId,
  sizeId,
  constructorId,
  userId,
  certificateId
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
      price,
    },
  ],
  paymentMethod: 'CASH',
  paymentStatus,
  certificateId,
  user_id: userId,
});
const newOrderUpdated = (productId, modelId, sizeId, constructorId, certificateId) => ({
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
      price,
    },
  ],
  paymentMethod: 'CASH',
  paymentStatus: 'APPROVED',
  promoCodeId: '',
  certificateId
});

module.exports = {
  newCertificateInputData,
  newOrderInputData,
  getOrdersInput,
  wrongId,
  email,
  newOrderUpdated,
  orderStatus,
  paymentStatus,
};
