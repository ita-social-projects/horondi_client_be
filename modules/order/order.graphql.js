const orderTypes = `
type Order {
  _id: ID!
  orderNumber: String
  paymentUrl: String
  status: Status
  recipient: OrderUser
  user_id: ID
  dateOfCreation: String
  lastUpdatedDate: String
  userComment: String
  cancellationReason:  String
  delivery: Delivery
  items: [OrderItem]
  totalItemsPrice: Int
  totalPriceToPay: Float
  isPaid: Boolean
  paymentMethod: PaymentEnum
  paymentStatus: PaymentStatusEnum
  fixedExchangeRate: Float
  promoCodeId: String
  certificateId: String
  itemsPriceWithDiscount: [Int]
  itemsDiscount: [Int]
}

enum PaymentStatusEnum {
  CREATED
  EXPIRED
  APPROVED
  DECLINED
  REVERSED
  PROCESSING
  PAID
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
  product: Product
  model: Model
  quantity: Int
  isFromConstructor: Boolean
  options: ItemOptions
  constructorBasics: Basics
  constructorPattern: Pattern
  constructorFrontPocket: Pocket
  constructorBottom: Bottom
  fixedPrice: Int
}
type Delivery {
  sentOn: String
  sentBy: SendByEnum
  invoiceNumber: String
  courierOffice: String,
  region: String,
  regionId: String
  district: String,
  districtId: String
  city: String,
  cityId: String
  street: String,
  house: String,
  flat: String,
  byCourier: Boolean
  messenger: String,
  messengerPhone: String,
  worldWideCountry: String,
  stateOrProvince: String,
  worldWideCity: String,
  worldWideStreet: String,
  cityCode: String
  cost: Int
}
enum SendByEnum{
  NOVAPOST
  UKRPOST
  SELFPICKUP
  NOVAPOSTCOURIER
  UKRPOSTCOURIER
  WORLDWIDE
}
type OrderUser {
  firstName: String
  lastName: String
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
  recipient: OrderUserInput,
  delivery: DeliveryInput,
  items: [OrderItemInput],
  paymentMethod: PaymentEnum
  userComment: String
  isPaid: Boolean
  paymentStatus: PaymentStatusEnum
  user_id: ID
  promoCodeId: String
  certificateId: String
}

input OrderUserInput {
  firstName: String
  lastName: String
  email: String
  phoneNumber: String
}

input DeliveryInput {
  sentOn: String
  sentBy: SendByEnum
  invoiceNumber: String
  courierOffice: String,
  region: String,
  regionId: String
  district: String,
  districtId: String
  city: String,
  cityId: String
  street: String,
  house: String,
  flat: String,
  byCourier: Boolean
  messenger: String,
  messengerPhone: String,
  worldWideCountry: String,
  stateOrProvince: String,
  worldWideCity: String,
  worldWideStreet: String,
  cityCode: String
  cost: Int
}

input OrderItemInput {
  product: ID
  model: ID
  constructorBasics: ID
  constructorBottom: ID
  constructorFrontPocket: ID
  constructorPattern: ID
  quantity: Int!
  isFromConstructor: Boolean
  options: ItemOptionsInput
  price: Int
}
input ItemOptionsInput{
  size: ID!
  sidePocket: Boolean
}
input OrderFilterInput{
    date:DateRangeInput
    status:[String]
    search:String
    paymentStatus:[String]
  }
`;

module.exports = {
  orderInputs,
  orderTypes,
};
