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
      language: Int
  }
`;
const paymentInputForCertificate = `
  input PaymentInputForCertificate {
    currency: String!
    amount: String!
    certificates: [CertificateInput]!
	 language: Int
  }
`;

module.exports = {
  paymentType,
  paymentInput,
  paymentInputForCertificate,
  paymentStatus,
};
