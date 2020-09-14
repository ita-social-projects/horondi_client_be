const deliveryTypes = ` 
  type NovaPoshtaCity {
    Description: String
    Ref: String
    CityID: String
  }

  type NovaPoshtaStreet {
    Description: String
    Ref: String
    StreetsTypeRef: String
    StreetsType: String
  }

  type NovaPoshtaWarehouse {
    Description: String
    ShortAddress: String
    Number: Int
    PlaceMaxWeightAllowed:  Int
    TotalMaxWeightAllowed: Int
    Phone: String
    Ref: String
    Schedule: WarehouseSchedule
  }

  type WarehouseSchedule {
    Monday: String
    Tuesday: String
    Wednesday: String
    Thursday: String
    Friday: String
    Saturday: String
    Sunday: String
  }

  type NovaPoshtaPrice {
      AssessedCost: Int
      Cost: Int
      CostRedelivery: Int
      CostPack: Int
  }

  type UkrPoshtaRegion {
     res: String
  }

  type NovaPoshtaOrder {
    Ref: String,
    CostOnSite: Float,
    IntDocNumber: String,
    TypeDocument: String
  }
` 

const deliveryInputs = ` 
  input NovaPoshtaOrderInput {
    CitySender: String,
    Weight: Float,
    PayerType: String,
    PaymentMethod: String,
    ServiceType: String,
    Cost: Float,
    CargoType: String,
    SeatsAmount: Int,
    Description: String,
    RecipientCityName: String,
    RecipientAddressName: String,
    RecipientName: String,
    RecipientType: String,
    RecipientsPhone: String,
    RecipientArea: String,
    RecipientAreaRegions: String,
    RecipientHouse: String,
    RecipientFlat: String,
  }

  input NovaPoshtaPriceInput {
    CitySender: String
    CityRecipient: String
    Weight: Float
    ServiceType: String
    Cost: Float
    CargoType: String
    SeatsAmount: Int
  }
` 

module.exports = { deliveryTypes, deliveryInputs };