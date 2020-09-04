const contactType = `
  type Contact {
    _id: ID!
    phoneNumber: String!
    openHours: [Language]!
    address: [Language]!
    email: String!
    images: ImageSet!
    link: String!
  }
`;

const contactInput = `
input contactInput {
  phoneNumber: String!
  openHours: [LanguageInput]!
  address: [LanguageInput]!
  email: String!
  images: ImageSetInput!
  link: String!
}`;

module.exports = { contactType, contactInput };
