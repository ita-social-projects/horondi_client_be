const axios = require('axios')
const CloudIpsp = require('cloudipsp-node-js-sdk')
const crypto = require('crypto')


class PaymentService {
    genSignature (data, secret) {
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
            orderId,
            orderDesc,
            currency,
            amount
        } = data 

        const fondy = new CloudIpsp(
            {
              merchantId: process.env.PAYMENT_MERCHANT_ID,
              secretKey: process.env.PAYMENT_SECRET
            }
          )
          const requestData = {
            order_id: orderId,
            order_desc: orderDesc,
            currency,
            amount
          }

          const res = await fondy.Checkout(requestData)
            .then(res => res)
            .catch((error) => error)
          
          return {
            paymentId: res.payment_id,
            responseStatus: res.response_status,
            checkoutUrl: res.checkout_url
          }
    }

    async getPaymentRefund({
      orderId,
      currency,
      amount,
    }){  
      const data = {
        orderId,
        currency,
        amount,
        merchantId: process.env.PAYMENT_MERCHANT_ID
      }
      const sig = this.genSignature(data, process.env.PAYMENT_SECRET)
     
      const res = await axios.post(
          process.env.PAYMENT_API_LINK,
          {
              request:{
                order_id: orderId, 
                currency,
                amount,
                merchant_id:process.env.PAYMENT_MERCHANT_ID,
                signature: sig
              }
          },
      );
    
      return {
        paymentId: res.data.response.payment_id,
        responseStatus: res.data.response.response_status,
        checkoutUrl: res.data.response.checkout_url
      }
  }
}

module.exports = new PaymentService()