const orderTypes = `
type Order {
  _id: ID!
  orderNumber: String
  status: Status,
  user: OrderUser
  dateOfCreation: String
  lastUpdatedDate: String
  userComment: String
  cancellationReason:  String
  delivery: Delivery
  items: [OrderItem]
  totalItemsPrice: [CurrencySet]
  totalPriceToPay: [CurrencySet]
  isPaid: Boolean
  paymentMethod: PaymentEnum
  paymentStatus: PaymentStatusEnum
}

enum PaymentStatusEnum {
  CREATED
  EXPIRED
  APPROVED
  DECLINED
  REVERSED
  PROCESSING
}

enum PaymentEnum {
  CARD
  CASH
}
enum Status {
  CREATED
  CONFIRMED 
  PRODUCED
  CANCELLED 
  REFUNDED 
  SENT
  DELIVERED
}
type OrderItem {
  productId: Product
  category: Category
  additions: [[Language]]
  actualPrice: [CurrencySet]
  quantity: Int
  isFromConstructor: Boolean
  options: ItemOptions
  constructorBasic:[ConstructorBasic]
  constructorPattern:[Pattern]
  constructorFrontPocket:[ConstructorFrontPocket]
  constructorBottom:[ConstructorBottom]
}
type Delivery {
  sentOn: String
  sentBy: String
  invoiceNumber: String
  courierOffice: Int
  byCourier: Boolean
  cost: [CurrencySet]
}
type OrderUser {
  firstName: String
  lastName: String
  patronymicName: String
  email: String
  phoneNumber: String
}
type ItemOptions{
  size: Size
  sidePocket: Boolean
}
`;
const orderInputs = ` 
input OrderInput {
  status: Status
  user: OrderUserInput,
  delivery: DeliveryInput,
  items: [OrderItemInput],
  paymentMethod: PaymentEnum
  userComment: String
  totalItemsPrice: [CurrencyInputSet]
  totalPriceToPay: [CurrencyInputSet]
  isPaid: Boolean
  paymentStatus: PaymentStatusEnum
}

input OrderUserInput {
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
  patronymicName: String
}

input CurrencyInputSet {
  currency: String
  value: Float
}

input DeliveryInput {
  sentOn: String
  sentBy: String
  invoiceNumber: String
  courierOffice: Int
  byCourier: Boolean
  cost: [CurrencyInputSet]
}

input OrderItemInput {
  productId: ID
  modelId: ID
  constructorBasics: ID
  constructorBottom: ID
  constructorFrontPocket: ID
  constructorPattern: ID
  actualPrice: [CurrencyInputSet!]
  quantity: Int!
  isFromConstructor: Boolean
  options: ItemOptionsInput
}
input ItemOptionsInput{
  size: ID
  sidePocket: Boolean
}
`;

module.exports = {
  orderInputs,
  orderTypes,
};
