const paymentService = require('./payment.service')

const paymentQuery = {
    getPaymentCheckout: (parent, args) => paymentService.getPaymentCheckout(args.data)
}

module.exports = { paymentQuery }