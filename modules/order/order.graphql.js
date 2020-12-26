const orderTypes = `
type Order {
  _id: ID!
  status: Status!
  orderNumber: String
  user: OrderUser!
  dateOfCreation: String!
  lastUpdatedDate: String
  adminComment: String
  userComment: String
  cancellationReason:  String
  delivery: Delivery
  address: Address
  items: [OrderItems]!
  totalItemsPrice: [CurrencySet]!
  totalPriceToPay: [CurrencySet]!
  isPaid: Boolean!
  paymentMethod: PaymentTypesEnum!
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
enum PaymentTypesEnum {
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
enum DeliveryOptions {
  NOVAPOST
  UKRPOST
  SELFPICKUP
}
type OrderItems {
  productId: String!
  sizeId: String
  additions: [[Language]]
  actualPrice: [CurrencySet]
  quantity: Int!
}
type Delivery {
  sentOn: String
  sentBy: DeliveryOptions!
  invoiceNumber: String
  courierOffice: Int
  byCourier: Boolean
  cost: [CurrencySet]
}
type OrderUser {
  userId: String
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
}
`;
const orderInputs = ` 
input OrderInput {
  user: OrderUserInput!,
  userComment: String
  adminComment: String
  cancellationReason: String
  delivery: DeliveryInput!,
  address: AddressInput
  items: [OrderItemsInput]!,
  paymentMethod: PaymentTypesEnum!
  totalItemsPrice: [CurrencyInputSet]!
}

input OrderUserInput {
  userId: String
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String!
}

input CurrencyInputSet {
  currency: String!
  value: Float!
}

input DeliveryInput {
  sentOn: String
  sentBy: DeliveryOptions!
  invoiceNumber: String
  courierOffice: Int
  byCourier: Boolean
  cost: [CurrencyInputSet]
}

input OrderItemsInput {
  productId: String!
  sizeId: String!,
  additions: [[LanguageInput]]
  actualPrice: [CurrencySetInput]!
  quantity: Int!
}
`;

module.exports = {
  orderInputs,
  orderTypes,
};
