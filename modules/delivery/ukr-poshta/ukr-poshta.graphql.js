const ukrPostaType = `
  type UkrPoshtaOrder {
    uuid: String
    deliveryPrice: Int
  }
  
  type UkrPoshtaRegion {
    REGION_ID: String
    REGION_UA: String
    REGION_EN: String
    REGION_KOATUU: String
    REGION_RU: String
  } 
  type UkrPoshtaDistricts {
    REGION_ID: String
    DISTRICT_EN: String
    REGION_UA: String
    REGION_EN: String
    DISTRICT_KOATUU: String
    DISTRICT_UA: String
    DISTRICT_ID: String
    REGION_KOATUU: String
    REGION_RU: String
    DISTRICT_RU: String
  }
  type UkrPoshtaCities {
    REGION_ID: String
    POPULATION: String
    DISTRICT_ID: String
    LONGITUDE: String
    CITY_RU: String
    DISTRICT_EN: String
    REGION_EN: String
    OLDCITY_RU: String
    SHORTCITYTYPE_EN: String
    CITYTYPE_UA: String
    OLDCITY_UA: String
    CITY_EN: String
    CITYTYPE_RU: String
    CITY_KOATUU: String
    REGION_RU: String
    NAME_UA: String
    REGION_UA: String
    OLDCITY_EN: String
    SHORTCITYTYPE_RU: String
    CITY_ID: String
    DISTRICT_UA: String
    CITYTYPE_EN: String
    SHORTCITYTYPE_UA: String
    LATTITUDE: String
    CITY_UA: String
    OWNOF: String
    DISTRICT_RU: String
  }
  type UkrPoshtaPostoffices {
    LOCK_EN: String
    CITY_UA_VPZ: String
    POSTTERMINAL: String
    POSTOFFICE_UA: String
    POSTCODE: String
    ISAUTOMATED: String
    PHONE: String
    LONGITUDE: String
    STREET_UA_VPZ: String
    POSTOFFICE_ID: String
    LOCK_UA: String
    CITY_UA_TYPE: String
    LOCK_CODE: String
    CITY_VPZ_ID: String
    CITY_KOATUU: String
    STREET_ID_VPZ: String
    LOCK_RU: String
    CITY_VPZ_KOATUU: String
    TYPE_ACRONYM: String
    TYPE_LONG: String
    TYPE_ID: String
    CITY_ID: String
    HOUSENUMBER: String
    LATTITUDE: String
    CITY_UA: String
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
