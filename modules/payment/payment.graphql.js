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
      orderDesc: String
      currency: String
      amount: Int!
  }
`;

module.exports = { paymentType, paymentInput, paymentStatus };
