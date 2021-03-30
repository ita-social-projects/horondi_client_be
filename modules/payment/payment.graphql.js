const paymentType = `
  type Payment {
    paymentId: String
    responseStatus: String!
    checkoutUrl: String
  }
`;
const paymentStatus = `
  type PaymentStatus {
    orderId: String!
    orderStatus: String!
    orderTime: String!
    amount: String!
    currency: String
  }
`;
const paymentInput = `
  input PaymentInput {
      orderId: String!
      currency: String!
      amount: String!
  }
`;

module.exports = { paymentType, paymentInput, paymentStatus };
