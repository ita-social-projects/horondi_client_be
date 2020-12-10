const newOrder = {
  user: {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@gmail.com',
    phoneNumber: '380983529807',
  },
  adminComment: '',
  userComment: '',
  cancellationReason: '',
  delivery: {
    sentOn: '',
    sentBy: 'Poshta',
  },
  address: {
    country: 'Ukraine',
    region: 'Lviv',
    city: 'Lviv',
    zipcode: 76009,
    street: 'street',
  },
  items: [
    {
      productId: 'c4889ff34ec751301a6683',
      size: '4cfa353a881b9fc17b3dce4f',
      actualPrice: [
        { value: 100, currency: 'USD' },
        { value: 1100, currency: 'UAN' },
      ],
      quantity: 1,
    },
    {
      productId: '00c4889ff34ec751301a6683',
      size: '4cfa353a881b9fc17b3dce4f',
      actualPrice: [
        { value: 120, currency: 'USD' },
        { value: 1400, currency: 'UAN' },
      ],
      quantity: 2,
    },
  ],
  paymentMethod: 'CASH',
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

const deliveryOrder = {
  sentBy: 'Nova Poshta',
  byCourier: true,
  courierOffice: 10,
  invoiceNumber: '6280260',
  sentOn: null,
};
const newOrderUpdated = {
  ...newOrderMutation,
  ...updatedData,
};

module.exports = {
  newOrder,
  newOrderUpdated,
  newOrderMutation,
  deliveryOrder,
};
