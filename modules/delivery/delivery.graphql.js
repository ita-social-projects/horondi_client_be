const deliveryType = ` 
  type NovaPoshtaCity {
    description: String
    ref: String
    cityID: String
  }

  type NovaPoshtaStreet {
    description: String
    ref: String
    streetsTypeRef: String
    streetsType: String
  }

  type NovaPoshtaWarehouse {
    description: String
    shortAddress: String
    number: Int
    placeMaxWeightAllowed:  Int
    totalMaxWeightAllowed: Int
    phone: String
    ref: String
    schedule: WarehouseSchedule
  }

  type WarehouseSchedule {
    monday: String
    tuesday: String
    wednesday: String
    thursday: String
    friday: String
    saturday: String
    sunday: String
  }

  type NovaPoshtaPrice {
      assessedCost: Int
      cost: Int
      costRedelivery: Int
      costPack: Int
  }

  type UkrPoshtaRegion {
     res: String
  }

  type NovaPoshtaOrder {
    ref: String,
    costOnSite: Float,
    intDocNumber: String,
    typeDocument: String
  }
` 

const deliveryInput = ` 
  input NovaPoshtaOrderInput {
    citySender: String,
    weight: Float,
    payerType: String,
    paymentMethod: String,
    serviceType: String,
    cost: Float,
    cargoType: String,
    seatsAmount: Int,
    description: String,
    recipientCityName: String,
    recipientAddressName: String,
    recipientName: String,
    recipientType: String,
    recipientsPhone: String,
    recipientArea: String,
    recipientAreaRegions: String,
    recipientHouse: String,
    recipientFlat: String,
  }

  input NovaPoshtaPriceInput {
    citySender: String
    cityRecipient: String
    weight: Float
    serviceType: String
    cost: Float
    cargoType: String
    seatsAmount: Int
  }
` 

module.exports = { deliveryType, deliveryInput };