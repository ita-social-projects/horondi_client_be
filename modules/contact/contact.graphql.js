const contactType = `
  type Contact {
    _id: ID!
    phoneNumber: String!
    openHours: [Language]!
    address: [Language]!
    email: String!
    link: Coords!
    translationsKey: ID!
  }
  type Coords {
    lat: String!
    lon: String!
  }
`;

const contactInput = `
input contactInput {
  phoneNumber: String!
  openHours: [LanguageInput]!
  address: [LanguageInput]!
  email: String!
  link: CoordsInput!
}
input CoordsInput {
  lat: String!
  lon: String!
}`;

module.exports = { contactType, contactInput };
