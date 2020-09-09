const { gql } = require('apollo-server-express');
const { newsType, newsInput } = require('./modules/news/news.graphql');
const {
  userType,
  userInput,
  userRegisterInput,
  LoginInput,
} = require('./modules/user/user.graphql');
const {
  productType,
  productInput,
} = require('./modules/product/product.graphql');
const {
  modelType,
  modelInput,
} = require('./modules/model/model.graphql');
const {
  categoryType,
  categoryInput,
} = require('./modules/category/category.graphql');
const {
  materialType,
  materialInput,
} = require('./modules/material/material.graphql');
const {
  patternsType,
  patternsInput,
} = require('./modules/pattern/pattern.graphql');
const {
  currencyType,
  currencyInput,
} = require('./modules/currency/currency.graphql.js');
const {
  commentType,
  commentInput,
} = require('./modules/comment/comment.graphql');
const {
  contactType,
  contactInput,
} = require('./modules/contact/contact.graphql');

const typeDefs = gql`
  ${categoryType}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternsType}
  ${userType}
  ${productType}
  ${commentType}
  ${modelType}
  ${contactType}

  scalar Upload

  enum RoleEnum {
    admin
    user
  }
  type Language {
    lang: String!
    value: String
  }
  type CurrencySet {
    currency: String!
    value: Int!
  }
  type ImageSet {
    large: String
    medium: String
    small: String
    thumbnail: String
  }
  type Credential {
    source: String
    tokenPass: String
  }

  type Address {
    country: String
    region: String
    city: String
    zipcode: Int
    street: String
    buildingNumber: String
    appartment: String
  }
  type PrimaryImage {
    primary: ImageSet
    additional: [ImageSet]
  }
  type ConvertOption {
    name: String
    exchangeRate: Float
  }
  type Subcategory {
    _id: ID!
    categoryCode: String
    name: [Language]
    images: ImageSet
    available: Boolean
  }
  type Author {
    name: [Language]
    image: ImageSet
  }
  type Color {
    code: Int
    name: [Language]
    images: ImageSet
    available: Boolean
    simpleName: [Language]
  }

  type ProductOptions {
    size: Size
    bottomMaterial: Material
    description: [Language]
    bottomColor: [Language]
    availableCount: Int
    additions: [ProductAdditions]
  }

  type ProductAdditions {
    name: [Language]
    description: [Language]
    available: Boolean
    additionalPrice: [CurrencySet]
  }

  type Size {
    _id: ID!
    name: String
    heightInCm: Int
    widthInCm: Int
    depthInCm: Int
    volumeInLiters: Int
    weightInKg: Float
    available: Boolean
    additionalPrice: [CurrencySet]
  }

  type UserForComment {
    email: String!
    name: String
    images: ImageSet
    isAdmin: Boolean
  }

  type UserRate {
    user: User!
    rate: Int!
  }

  type Error {
    statusCode: Int
    message: String
  }

  type ProductOptionsAdditonals {
    name: [Language!]
    description: [Language!]
    available: Boolean
    additionalPrice: Int
  }

  type PaginatedProducts {
    items: [Product]
    count: Int
  }

  type PaginatedNews {
    items: [News]
    count: Int
  }

  type SuccessfulResponse {
    isSuccess: Boolean
  }

  type NovaPoshtaCity {
    Description: String
    Ref: String
    CityID: String
  }

  type NovaPoshtaWarehouse {
    Description: String
    ShortAddress: String
    Number: Int
    PlaceMaxWeightAllowed:  Int
    TotalMaxWeightAllowed: Int
    Phone: String
    Ref: String
    Schedule: WarehouseSchedule
  }

  type WarehouseSchedule {
    Monday: String
    Tuesday: String
    Wednesday: String
    Thursday: String
    Friday: String
    Saturday: String
    Sunday: String
  }

  type NovaPoshtaPrice {
      AssessedCost: Int
      Cost: Int
      CostRedelivery: Int
      CostPack: Int
  }

  type UkrPoshtaRegion {
     res: String
  }

  type NovaPoshtaOrder {
    Ref: String,
    CostOnSite: Float,
    IntDocNumber: String,
    TypeDocument: String
  }

  type Payment {
    payment_id: String
    response_status: String
    checkout_url: String
  }

  union CategoryResult = Category | Error
  union CurrencyResult = Currency | Error
  union MaterialResult = Material | Error
  union PatternResult = Pattern | Error
  union NewsResult = News | Error
  union ProductResult = Product | Error
  union CommentResult = Comment | Error
  union LogicalResult = SuccessfulResponse | Error
  union ModelResult = Model | Error
  union ContactResult = Contact | Error
  union NovaPoshtaCityResult = NovaPoshtaCity | Error
  union NovaPoshtaWarehouseResult = NovaPoshtaWarehouse | Error
  union NovaPoshtaPriceResult = NovaPoshtaPrice | Error
  union UkrPoshtaRegionResult = UkrPoshtaRegion | Error

  type Query {
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID): CurrencyResult

    getAllCategories: [Category]
    getCategoryById(id: ID): CategoryResult

    getAllMaterials: [Material!]!
    getMaterialById(id: ID): MaterialResult

    getAllPatterns: [Pattern!]!
    getPatternById(id: ID): PatternResult

    getAllNews(limit: Int, skip: Int): PaginatedNews!
    getNewsById(id: ID): NewsResult

    getAllUsers: [User]
    getUserByToken: User
    getUserById(id: ID!): User

    getProductById(id: ID!): ProductResult
    getProducts(
      filter: FilterInput
      limit: Int
      skip: Int
      search: String
      sort: SortInput
    ): PaginatedProducts!

    getCommentById(id: ID!): CommentResult
    getAllCommentsByProduct(productId: ID!): [CommentResult]

    getModelsByCategory(id: ID!): [Model]

    getContacts: [ContactResult!]!
    getContactById(id: ID!): ContactResult

    getNovaPoshtaCities(city: String):[NovaPoshtaCityResult]
    getNovaPoshtaWarehouses(city: String): [NovaPoshtaWarehouseResult]
    getNovaPoshtaPrice(data: NovaPoshtaPriceInput): [NovaPoshtaPriceResult]
    createNovaPoshtaOrder(data: NovaPoshtaOrderInput): NovaPoshtaOrder

    getUkrPoshtaRegion(region: String): UkrPoshtaRegion

    getPaymentCheckout(data: PaymentInput): Payment
    getPaymentRefund(data: PaymentInput): Payment
  }

  input SortInput {
    purchasedCount: Int
    basePrice: Int
    rate: Int
    isHotItem: Boolean
  }

  input FilterInput {
    pattern: [String]
    materials: [String]
    colors: [String]
    price: [Int]
    category: [String]
    search: String
    isHotItem: Boolean
    models: [String]
    currency: Int
  }
  input RoleEnumInput {
    role: String
  }
  input PrimaryImageInput {
    primary: ImageSetInput!
    additional: [ImageSetInput!]
  }
  input AuthorInput {
    name: [LanguageInput]
    image: ImageSetInput
  }
  ${categoryInput}
  ${currencyInput}
  ${materialInput}
  ${newsInput}
  ${patternsInput}
  ${userInput}
  ${productInput}
  ${commentInput}
  ${LoginInput}
  ${userRegisterInput}
  ${modelInput}
  ${contactInput}

  input LanguageInput {
    lang: String!
    value: String
  }
  input CurrencySetInput {
    currency: String!
    value: Int!
  }
  input AddressInput {
    country: String
    region: String
    city: String
    zipcode: Int
    street: String
    buildingNumber: String
    appartment: String
  }
  input UserForCommentInput {
    email: String!
    name: String
    images: ImageSetInput
    isAdmin: Boolean
  }
  input ImageSetInput {
    large: String
    medium: String
    small: String
    thumbnail: String
  }
  input ColorInput {
    code: Int!
    name: [LanguageInput!]
    images: ImageSetInput
    available: Boolean!
    simpleName: [LanguageInput!]
  }
  input ConvertOptionInput {
    name: String!
    exchangeRate: Float!
  }
  input SubcategoryInput {
    categoryCode: String!
    name: [LanguageInput!]
    images: ImageSetInput
    available: Boolean!
  }
  input CredentialInput {
    source: String
    tokenPass: String
  }

  type File {
    fileNames: ImageSet! 
    prefixUrl: String!
  }

  input ProductOptionsInput {
    size: ID!
    bottomMaterial: ID!
    description: [LanguageInput!]
    bottomColor: [LanguageInput!]
    availableCount: Int
    additions: [ProductOptionsAdditonalsInput]
  }
  input NovaPoshtaOrderInput {
    CitySender: String,
    Weight: Float,
    PayerType: String,
    PaymentMethod: String,
    ServiceType: String,
    Cost: Float,
    CargoType: String,
    SeatsAmount: Int,
    Description: String,
    RecipientCityName: String,
    RecipientAddressName: String,
    RecipientName: String,
    RecipientType: String,
    RecipientsPhone: String,
  }

  input SizeInput {
    name: String
    heightInCm: Int
    widthInCm: Int
    depthInCm: Int
    volumeInLiters: Int
    weightInKg: Float
    available: Boolean
    additionalPrice: Int
  }
  input ProductOptionsAdditonalsInput {
    name: [LanguageInput!]
    description: [LanguageInput!]
    available: Boolean
    additionalPrice: [CurrencySetInput]
  }
  input UserRateInput {
    rate: Int!
  }
  input NovaPoshtaPriceInput {
    CitySender: String
    CityRecipient: String
    Weight: Float
    ServiceType: String
    Cost: Float
    CargoType: String
    SeatsAmount: Int
  }

  input PaymentInput {
    order_id: String
    order_desc: String
    currency: String
    amount: Int
  }

  type Mutation {
    uploadFiles(files: [Upload]!): [File]!
    deleteFiles(fileNames: [String]): [String]
    "Pattern Mutations"
    addPattern(pattern: PatternInput!): PatternResult
    deletePattern(id: ID!): PatternResult
    updatePattern(id: ID!, pattern: PatternInput!): PatternResult
    "Material Mutation"
    addMaterial(material: MaterialInput!): MaterialResult
    deleteMaterial(id: ID!): MaterialResult
    updateMaterial(id: ID!, material: MaterialInput!): MaterialResult

    "Category Mutation"
    addCategory(category: CategoryInput!): CategoryResult
    deleteCategory(id: ID!): CategoryResult
    updateCategory(id: ID!, category: CategoryInput!): CategoryResult

    "Currency Mutation"
    addCurrency(currency: CurrencyInput!): CurrencyResult
    deleteCurrency(id: ID!): CurrencyResult
    updateCurrency(id: ID!, currency: CurrencyInput!): CurrencyResult

    "News Mutation"
    addNews(news: NewsInput!): NewsResult
    deleteNews(id: ID!): NewsResult
    updateNews(id: ID!, news: NewsInput!): NewsResult

    "User Mutation"
    registerUser(user: userRegisterInput!): User
    loginUser(loginInput: LoginInput!): User
    loginAdmin(loginInput: LoginInput!): User
    deleteUser(id: ID!): User
    updateUserById(user: UserInput!, id: ID!): User
    updateUserByToken(user: UserInput!): User
    confirmUser(token: String!): Boolean
    recoverUser(email: String!, language: Int!): Boolean
    switchUserStatus(id: ID!): LogicalResult
    resetPassword(password: String!, token: String!): Boolean
    checkIfTokenIsValid(token: String!): Boolean

    "Product Mutation"
    addProduct(product: ProductInput!): ProductResult
    deleteProduct(id: ID!): ProductResult
    updateProduct(id: ID!, product: ProductInput!): ProductResult

    "Comment Mutation"
    addComment(productId: ID!, comment: commentInput!): CommentResult
    deleteComment(id: ID!): CommentResult
    updateComment(id: ID!, comment: commentInput!): CommentResult
    
    "Rate Mutation"
    addRate(product: ID!, userRate: UserRateInput!): ProductResult

    "Model Mutation"
    addModel(model: ModelInput!): ModelResult
    updateModel(id: ID!, model: ModelInput!): ModelResult
    deleteModel(id: ID!): ModelResult

    "Contacts Mutation"
    addContact(contact: contactInput!): ContactResult
    deleteContact(id: ID!): ContactResult
    updateContact(id: ID!, contact: contactInput!): ContactResult
  }
`;

module.exports = typeDefs;
