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
    wishlist: [Product]
    cart: [CartProduct]
    orders:[ID]
    purchasedProducts: [ID]
    comments: [ID]
    banned: Boolean
    confirmed: Boolean
}`;

const paginatedUsersType = `
type PaginatedUsersType {
    items: [User!]
    count: Int!
}
`;

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
    cart: [CartProductInput]
    orders:[ID]
    purchasedProducts: [ID]
    comments: [ID]
    banned: Boolean
    confirmed: Boolean
}`;
const userUpdateInput = `
input UserUpdateInput {
    firstName: String
    lastName: String
    password: String
    email: String
    phoneNumber: String
    address: AddressInput
    images: ImageSetInput
    wishlist: [ID]
    cart: [CartProductInput]
    orders:[ID]
    purchasedProducts: [ID]
    comments: [ID]
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

const UserForStatisticsInput = `
input UserForStatisticsInput {
    days: Int!
}
`;

const userFilterInput = `
input UserFilterInput {
    roles: [String!]
    banned: [Boolean!]
    search: String
}
`;

const userSortInput = `
input UserSortInput {
  name: Int
  email: Int
}
`;

module.exports = {
  userType,
  userInput,
  userUpdateInput,
  userRegisterInput,
  userFilterInput,
  LoginInput,
  adminRegisterInput,
  adminConfirmInput,
  UserForStatisticsInput,
  paginatedUsersType,
  userSortInput,
};
