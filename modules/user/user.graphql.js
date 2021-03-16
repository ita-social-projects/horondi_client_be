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
    refreshToken: String
    invitationalToken: String
    credentials: [Credential]
    registrationDate: String
    wishlist: [Product]
    cart: Cart
    orders:[ID]
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
    orders:[ID]
    comments: [ID]
    cart: CartInput
    banned: Boolean
    confirmed: Boolean
}`;
const cartType = `
  type Cart {
    items: CartItem
    totalPrice: [CurrencySet]
    rememberMailCount: Int
  }

  type CartItem {
    product: Product
    productFromConstructor: ProductFromConstructor
    quantity: Int
    price: [CurrencySet]
    options: Options
  }
  
   type Options {
    size: Size
  } 
  
    type ProductFromConstructor {
    model: Model
    constructorBasics: ConstructorBasic
    constructorBottom: ConstructorBottom    
    constructorFrontPocket: ConstructorFrontPocket    
    constructorPattern: Pattern
    constructorImage: String
  }
`;
const cartInput = ` 
  input CartInput {
    items: [CartItemInput]
  }

  input CartItemInput {
    product: ID
    productFromConstructor: ProductFromConstructorInput
    quantity: Int!
    options: OptionsInput
  }
    input ProductFromConstructorInput {
    model: ID
    constructorBasics: ID
    constructorBottom: ID
    constructorFrontPocket: ID
    constructorPattern: ID
    constructorImage: String
  }
  
  input OptionsInput {
   size: ID!
  }
`;

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
    wishlist: [ID]
    orders:[ID]
    comments: [ID]
    confirmed: Boolean
}`;
const LoginInput = `
input LoginInput {
    password: String!
    email: String!
    staySignedIn: Boolean
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
  adminConfirmInput,
  UserForStatisticsInput,
  paginatedUsersType,
  userSortInput,
  tokenType,
  purchasedProductsType,
  cartType,
  cartInput,
};
