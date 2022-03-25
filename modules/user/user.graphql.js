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
    configs: UserConfigs
    token: String
    refreshToken: String
    invitationalToken: String
    recoveryToken: String
    confirmationToken: String
    credentials: [Credential]
    registrationDate: String
    orders:[ID]
    comments: [ID]
    banned: UserBlockPeriod
    confirmed: Boolean
    isSuccess: Boolean
}

type UserConfigs {
    currency: Int
    language: String
    theme: String
}

type UserBlockPeriod {
  blockPeriod: String
  blockCount: Int
  updatedAt: Date
}

type UserConfirmed {
   token: String,
   refreshToken:String,
   confirmed:Boolean
}
`;

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
    image: Upload
    orders:[ID]
    comments: [ID]
    banned: Boolean
    confirmed: Boolean
}`;

const userUpdateInput = `
input UserUpdateInput {
    _id: ID
    firstName: String
    lastName: String
    password: String
    email: String
    phoneNumber: String
    address: AddressInput
    images: ImageSetInput
    orders:[ID]
    comments: [ID]
    confirmed: Boolean
    configs: ConfigsUserInput
}`;
const LoginInput = `
input LoginInput {
    password: String!
    email: String!
    rememberMe: Boolean
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
    otp_code: String
}
`;

const resendEmailToConfirmAdminInput = `
input resendEmailToConfirmAdminInput {
    email: String!
}
`;

const confirmSuperadminCreationInput = `
input confirmSuperadminCreationInput {
    _id: ID!
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
    banned: [String]
    search: String
}
`;

const userSortInput = `
input UserSortInput {
  name: Int
  email: Int
}
`;

const tokenType = `
type Token {
  token: String
  refreshToken: String
  accessToken: String
}
`;
const purchasedProductsType = `
    type PurchasedProduct {
        _id: ID!
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
  resendEmailToConfirmAdminInput,
  confirmSuperadminCreationInput,
  adminConfirmInput,
  UserForStatisticsInput,
  paginatedUsersType,
  userSortInput,
  tokenType,
  purchasedProductsType,
};
