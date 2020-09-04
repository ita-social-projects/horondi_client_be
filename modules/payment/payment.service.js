const request = require('request');
const util = require('util')
const post = util.promisify(request.post)
const CloudIpsp = require('cloudipsp-node-js-sdk')

class PaymentService {
    async getPaymentCheckout(data){  
        const {
            order_id = 'Unique1',
            order_desc = 'test order',
            currency = 'UAH',
            amount = 1
        } = data

        const fondy = new CloudIpsp(
            {
              merchantId: 1396424,
              secretKey: 'test'
            }
          )
          const requestData = {
            order_id,
            order_desc,
            currency,
            amount
          }
          return await fondy.Checkout(requestData)
          .then(res => res)
          .catch((error) => error)
    }
}

module.exports = new PaymentService()