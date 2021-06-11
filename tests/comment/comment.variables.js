const userWrongId = '5fae5ab81069f737a6d4c00d';
const productWrongId = '5faa3d306071ad276cc3d63f';
const commentWrongId = '5faa3d306071ad276cc3d63c';
const wrongData = '123siSTm#';
const rate = 4;
const updatedRate = 1;

const newComment = userId => ({
  text: 'Test text',
  user: userId,
  show: false,
});
const updatedComment = {
  text: 'updated text',
  show: true,
};
const newReplyComment = (userId, commentID) => ({
  replyText: 'Reply text',
  answerer: userId,
  refToReplyComment: commentID,
});

const updatedReplyComment = {
  replyText: 'updated text',
  showReplyComment: true,
};
const newOrderInputData = (
  productId,
  modelId,
  sizeId,
  constructorId,
  email
) => ({
  status: 'DELIVERED',
  user: {
    firstName: 'Arsen',
    lastName: 'Wenger',
    email,
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
});

module.exports = {
  userWrongId,
  newComment,
  wrongData,
  updatedComment,
  commentWrongId,
  productWrongId,
  rate,
  updatedRate,
  newOrderInputData,
  newReplyComment,
  updatedReplyComment,
};
