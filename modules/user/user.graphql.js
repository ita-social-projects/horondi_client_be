const userType = `
type User{
    _id:ID!
    firstName: String
    lastName: String
    password: String
    role: RoleEnum
    email: String
    phoneNumber: String
    address: Address
    images: ImageSet
    token: String
    invitationalToken: String
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
    email: String
    phoneNumber: String
    address: AddressInput
    images: ImageSetInput
    wishlist: [ID]
    orders:[ID]
    purchasedProducts: [ID]
    comments: [ID]
    banned: Boolean
    confirmed: Boolean
}`;
const LoginInput = `
input LoginInput {
    password: String!
    email: String!
}`;

const userRegisterInput = `
input userRegisterInput {
    firstName: String!
    lastName: String!
    password: String!
    email: String!
}`;

const adminRegisterInput = `
input AdminRegisterInput {
    email: String!
    role: String!
}
`;
const adminConfirmInput = `
input AdminConfirmInput {
    firstName: String!
    lastName: String!
    password: String!
}
`;

module.exports = {
  userType,
  userInput,
  userRegisterInput,
  LoginInput,
  adminRegisterInput,
  adminConfirmInput,
};
