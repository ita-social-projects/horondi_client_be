const request = require('request');
const util = require('util')
const post = util.promisify(request.post)
const CloudIpsp = require('cloudipsp-node-js-sdk')
const crypto = require('crypto')


class PaymentService {
  genSignature (data, secret) {
    console.log(data);
    const ordered = {}
    Object.keys(data).sort().forEach(function (key) {
      if (data[key] !== '' && key !== 'signature' && key !== 'response_signature_string') {
        ordered[key] = data[key]
      }
    })
    const signString = secret + '|' + Object.values(ordered).join('|')
    return crypto.createHash('sha1').update(signString).digest('hex')
  }

    async getPaymentCheckout(data){  
       const {
            order_id = 'Unique12',
            order_desc = 'test order',
            currency = 'UAH',
            amount = 1
        } = data 

        const fondy = new CloudIpsp(
            {
              merchantId: process.env.PAYMENT_MERCHANT_ID,
              secretKey: process.env.PAYMENT_SECRET
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

    async getPaymentRefund({
      order_id = 'Unique12',
      currency = 'UAH',
      amount = 1,
    }){  
      const data = {
        order_id,
        currency,
        amount,
        merchant_id: process.env.PAYMENT_MERCHANT_ID
      }
      const sig = this.genSignature(data, process.env.PAYMENT_SECRET)
     
      const res = await post(
          'https://api.fondy.eu/api/reverse/order_id',
          { 
            json: true,
            body: {
              request:{
                order_id, 
                currency,
                amount,
                merchant_id:process.env.PAYMENT_MERCHANT_ID,
                signature: sig
              }
            }
          },
      );

      return res
  }
}

module.exports = new PaymentService()