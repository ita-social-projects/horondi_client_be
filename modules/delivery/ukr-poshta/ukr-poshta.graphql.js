const ukrPostaType = `
  type UkrPoshtaOrder {
    uuid: ID
  }
`;

const ukrPoshtaInput = `
  input UkrPoshtaClientInput {
    address: UkrPoshtaAddressInput!
    firstName: String
    lastName: String
    phoneNumber: String
    type: UkrPoshtaTypeEnum
  }
  input UkrPoshtaAddressInput {
    postcode: Int!
    country: String
    region: String
    city: String
    district: String
    street: String
    houseNumber: Int
    apartmentInt: Int
  }
  input UkrPoshtaOrderInput {
    weight: Int,
    length: Int,
    width: Int,
    height: Int,
    postPay: Int,
    recommended: Boolean,
    sms: Boolean,
    paidByRecipient: Boolean,
    description: String,
    parcels: [UkrPoshtaParcerInput]
  }

  input UkrPoshtaParcerInput {
    name: String,
    weight: Int,
    length: Int,
    declaredPrice: Int
  }
`;

const ukrPoshtaEnum = `
  enum UkrPoshtaTypeEnum {
    INDIVIDUAL
    COMPANY
    PRIVATE_ENTREPRENEUR
    EMPLOYEE
  }
`;

module.exports = {
  ukrPoshtaEnum,
  ukrPoshtaInput,
  ukrPostaType,
};
