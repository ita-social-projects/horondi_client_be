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
  product: ProductItem
  modelId: Model
  actualPrice: [CurrencySet]
  quantity: Int
  isFromConstructor: Boolean
  options: ItemOptions
  constructorBasic: ConstructorBasicItem
  constructorPattern: Pattern
  constructorFrontPocket: ConstructorFrontPocketItem
  constructorBottom: ConstructorBottomItem
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
type ProductItem {
  _id: Product
  fixedPrice: [CurrencySet]
}
type ConstructorBasicItem {
  _id: ConstructorBasic,
  fixedPrice: [CurrencySet]
}

type ConstructorFrontPocketItem {
  _id: ConstructorFrontPocket,
  fixedPrice: [CurrencySet]
}
type ConstructorBottomItem {
  _id: ConstructorBottom,
  fixedPrice: [CurrencySet]
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
  product: ProductItemInput
  modelId: ID
  constructorBasics: ConstructorBasicItemInput
  constructorBottom: ConstructorBottomItemInput
  constructorFrontPocket: ConstructorFrontPocketItemInput
  constructorPattern: ID
  actualPrice: [CurrencyInputSet]
  quantity: Int!
  isFromConstructor: Boolean
  options: ItemOptionsInput
}
input ItemOptionsInput{
  size: sizeInput!
  sidePocket: Boolean
}
input sizeInput{
  _id: ID!
}
input ProductItemInput{
  _id: ID!
}
input ConstructorBasicItemInput {
  _id: ID!
}
input ConstructorFrontPocketItemInput {
  _id: ID!
}
input ConstructorBottomItemInput {
  _id: ID!
}
`;

module.exports = {
  orderInputs,
  orderTypes,
};
