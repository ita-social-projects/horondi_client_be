const paymentType = `
  type Payment {
    paymentId: String
    responseStatus: String
    checkoutUrl: String
  }
`

const paymentInput = `
  input PaymentInput {
      orderId: String
      orderDesc: String
      currency: String
      amount: Int
  }
`

module.exports = { paymentType, paymentInput };