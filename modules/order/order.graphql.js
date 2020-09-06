const orderType = `
    type Order{
        status: String
        user: UserForOrder
        dateOfCreation: String
        delivery: Delivery
        items: [ProductForOrder]
        totalPrice: [CurrencySet]
        paymentMethod: String
    }
`

module.exports = {
    orderType
}