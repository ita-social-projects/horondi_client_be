const orderType = `
type Order {
  _id: ID!
  status: String
  user: OrderUser,
  dateOfCreation: String,
  delivery: Delivery,
  items: [OrderItems],
  totalPrice: [CurrencySet]
  paymentMethod: String
}`
const orderInput = ` 
input OrderInput {
  status: String
  user: OrderUserInput,
  dateOfCreation: String,
  delivery: DeliveryInput,
  items: [OrderItemsInput],
  totalPrice: [CurrencySetInput]
  paymentMethod: String
}`

module.exports = {
    orderInput, 
    orderType
}