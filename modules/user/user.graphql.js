const userType = `
type User{
    id:ID!
    firstName: String
    lastName: String
    role: RoleEnum
    email: String
    phoneNumber: Int
    address: Address
    images: ImageSet
    token: String
    credentials: [Credential]
      registrationDate: String
      wishlist: [ID]
      cart: [ID]
      orders:[ID]
      purchasedProducts: [ID]

}`;

const userInput = `
input UserInput {
    firstName: String
    lastName: String
    role: String
    password: String
    confirmPassword: String
    email: String
    phoneNumber: Int
    address: AddressInput
    images: ImageSetInput
    credentials: [CredentialInput]
    registrationDate: String
    wishlist: [ID]
    cart: [ID]
    orders:[ID]
    purchasedProducts: [ID]
}`;

module.exports = { userType, userInput };
