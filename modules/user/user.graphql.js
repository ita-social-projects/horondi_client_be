const userType = `
type User{
    id:ID!
    firstName: String!
    lastName: String!
    password: String
    role: RoleEnum
    email: String!
    phoneNumber: Int
    address: Address
    images: ImageSet
    token: String!
    credentials: [Credential]
    registrationDate: String
    wishlist: [ID]
    orders:[ID]
    purchasedProducts: [ID]
    comments: [ID]
    banned: Boolean
    confirmed: Boolean
}`;

const userInput = `
input UserInput {
    firstName: String
    lastName: String
    password: String
    role: String
    email: String!
    phoneNumber: Int
    address: AddressInput
    images: ImageSetInput
    credentials: [CredentialInput]
    registrationDate: String
    wishlist: [ID]
    orders:[ID]
    purchasedProducts: [ID]
    comments: [ID]
    banned: Boolean
    confirmed: Boolean
}`;

module.exports = { userType, userInput };
