const { gql } = require('apollo-server-express');
const { newsType, newsInput } = require('./modules/news/news.graphql');
const {
  userType,
  userInput,
  userUpdateInput,
  userRegisterInput,
  userFilterInput,
  userSortInput,
  LoginInput,
  adminConfirmInput,
  adminRegisterInput,
  UserForStatisticsInput,
  paginatedUsersType,
  tokenType,
} = require('./modules/user/user.graphql');
const {
  productType,
  productInput,
  cartProductType,
  cartProductInput,
} = require('./modules/product/product.graphql');
const { orderTypes, orderInputs } = require('./modules/order/order.graphql');
const { modelType, modelInput } = require('./modules/model/model.graphql');
const {
  categoryType,
  categoryInput,
} = require('./modules/category/category.graphql');
const {
  materialType,
  materialInput,
} = require('./modules/material/material.graphql');
const {
  patternType,
  patternInput,
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
  businessTextType,
  businessTextInput,
} = require('./modules/business-text/business-text.graphql');
const {
  contactType,
  contactInput,
} = require('./modules/contact/contact.graphql');
const {
  deliveryType,
  deliveryInput,
} = require('./modules/delivery/delivery.graphql');
const {
  emailQuestionType,
  emailQuestionInput,
} = require('./modules/email-chat/email-question.graphql');
const {
  paymentType,
  paymentStatus,
  paymentInput,
} = require('./modules/payment/payment.graphql');
const {
  homePageImagesType,
} = require('./modules/homepage-images/home-page-images.graphql');
const {
  homePageSlideType,
  homePageSlideInput,
} = require('./modules/homepage-slider/homepage-slider.graphql');
const { headerType, headerInput } = require('./modules/header/header.graphql');
const { defaultPaginationParams } = require('./consts');
const { sizeType } = require('./modules/size/size.graphql');

const { skip, limit } = defaultPaginationParams;

const typeDefs = gql`
  ${categoryType}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternType}
  ${userType}
  ${paginatedUsersType}
  ${productType}
  ${cartProductType}
  ${commentType}
  ${businessTextType}
  ${modelType}
  ${contactType}
  ${orderTypes}
  ${emailQuestionType}
  ${deliveryType}
  ${paymentType}
  ${paymentStatus}
  ${homePageImagesType}
  ${headerType}
  ${homePageSlideType}
  ${tokenType}
  ${sizeType}

  scalar Upload
  scalar Date
  enum RoleEnum {
    superadmin
    admin
    user
  }
  type Language {
    lang: String!
    value: String
  }
  type CurrencySet {
    currency: String!
    value: Float!
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
    zipcode: String
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
  type ModelsMenu {
    model: [Menu!]
  }
  type Menu {
    _id: ID!
    name: [Language!]
  }
  type BurgerMenu {
    category: Menu!
    models: [Menu!]
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
  type CartProductBagBottom {
      name: [Language]
      value: String
  }
  type CartProductDimensions {
      volumeInLiters: Int
      weightInKg: Float
  }
  type AllProductOptions {
    sizes: [Size]
    bottomMaterials: [Material]
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
  type PaginatedPatterns {
    items: [Pattern!]!
    count: Int!
  }
  type PaginatedOrders {
    items: [Order!]!
    count: Int!
  }
  type PaginatedNews {
    items: [News]
    count: Int
  }
  type PaginatedMaterials {
    items: [Material]
    count: Int
  }
  type PaginatedContacts {
    items: [Contact]
    count: Int
  }
  type PaginatedModels {
    items: [Model]
    count: Int
  }
  type PaginatedEmailQuestion {
    questions: [EmailQuestion]
    count: Int
  }
  type LanguageImageSet {
    lang: String
    value: ImageSet
  }
  type PaginatedComments {
    items: [Comment]
    count: Int
  }
  type SuccessfulResponse {
    isSuccess: Boolean
  }
  type EmailAnswer {
    admin: User!
    date: String!
    text: String!
  }
  type StatisticDoughnut {
    names: [String!]
    counts: [Int!]
    relations: [Int!]
  }
  type StatisticBar {
    labels: [String!]
    counts: [Int!]
    total: Int!
  }
  type PaginatedHomePageSlides {
      items: [HomePageSlide]
      count: Int
  }
  union CategoryResult = Category | Error
  union CurrencyResult = Currency | Error
  union MaterialResult = Material | Error
  union MaterialColorResult = Color | Error
  union PatternResult = Pattern | Error
  union NewsResult = News | Error
  union ProductResult = Product | Error
  union CommentResult = Comment | Error
  union BusinessTextResult = BusinessText | Error
  union LogicalResult = SuccessfulResponse | Error
  union ModelResult = Model | Error
  union ContactResult = Contact | Error
  union OrderResult = Order | Error
  union UserResult = User | Error
  union EmailQuestionResult = EmailQuestion | Error
  union NovaPoshtaOrderResult = NovaPoshtaOrder | Error
  union HeaderResult = Header | Error
  union HomepageImagesResult = HomePageImages | Error
  union HomePageSlideResult = HomePageSlide | Error
  union TokenResult = Token | Error
  
  type Query {
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID): CurrencyResult
    getAllCategories: [Category]
    getPopularCategories: StatisticDoughnut!
    getCategoryById(id: ID): CategoryResult
    getCategoriesForBurgerMenu: [BurgerMenu]
    getAllMaterials(limit: Int, skip: Int): PaginatedMaterials!
    getMaterialById(id: ID): MaterialResult
    getMaterialColorByCode(code: Int): Color
    getAllPatterns(limit: Int, skip: Int): PaginatedPatterns!
    getPatternById(id: ID): PatternResult
    getAllOrders(limit: Int, skip: Int, filter: FilterInput): PaginatedOrders!
    getOrderById(id: ID): OrderResult
    getUserOrders: [Order!]
    getOrdersStatistic(date: Int!): StatisticDoughnut!
    getPaidOrdersStatistic(date: Int!): StatisticBar!
    getAllNews(limit: Int, skip: Int): PaginatedNews!
    getNewsById(id: ID): NewsResult
    getAllUsers(
      filter: UserFilterInput
      pagination: Pagination
      sort: UserSortInput
    ): PaginatedUsersType!
    getUsersForStatistic(filter: UserForStatisticsInput): StatisticBar!
    getUserByToken: UserResult
    getUserById(id: ID!): User
    validateConfirmationToken(token: String!): LogicalResult!
    getProductById(id: ID!): ProductResult
    getProducts(
      filter: FilterInput
      limit: Int
      skip: Int
      search: String
      sort: SortInput
    ): PaginatedProducts!
    getProductOptions: AllProductOptions
    getPopularProducts: StatisticBar!
    getCommentById(id: ID!): CommentResult
    getAllCommentsByProduct(
      productId: ID!
      skip: Int
      limit: Int
    ): PaginatedComments!
    getAllRecentComments(limit: Int, skip: Int): PaginatedComments!
    getAllCommentsByUser(userEmail: String!): [Comment]
    getAllBusinessTexts: [BusinessText]
    getBusinessTextById(id: ID!): BusinessTextResult
    getBusinessTextByCode(code: String!): BusinessTextResult
    getAllModels(limit: Int, skip: Int): PaginatedModels
    getModelsByCategory(id: ID!): [Model]
    getModelById(id: ID!): ModelResult
    getContacts(limit: Int, skip: Int): PaginatedContacts!
    getContactById(id: ID!): ContactResult
    getNovaPoshtaCities(city: String): [NovaPoshtaCity]
    getNovaPoshtaStreets(cityRef: String, street: String): [NovaPoshtaStreet]
    getNovaPoshtaWarehouses(city: String): [NovaPoshtaWarehouse]
    getNovaPoshtaPrices(data: NovaPoshtaPriceInput): [NovaPoshtaPrice]
    createNovaPoshtaOrder(data: NovaPoshtaOrderInput): NovaPoshtaOrderResult
    getUkrPoshtaRegion(region: String): UkrPoshtaRegion
    getPaymentCheckout(data: PaymentInput): Payment
    getPaymentStatus(orderId: String!): PaymentStatus
    getPaymentRefund(data: PaymentInput): Payment
    getAllEmailQuestions(
      filter: FilterInput
      skip: Int
    ): PaginatedEmailQuestion!
    getEmailQuestionById(id: ID!): EmailQuestionResult
    getHomePageLooksImages: [HomePageImages]
    getPendingEmailQuestionsCount: Int
    getAllHeaders: [Header!]!
    getHeaderById(id: ID!): HeaderResult
    getAllSlides(limit: Int, skip: Int): PaginatedHomePageSlides!
    getSlideById(id: ID!): HomePageSlideResult
    getAllSizes: [Size]  
    getSizeById(id: ID!): Size
  }
  input Pagination {
      skip: Int = ${skip}
      limit: Int = ${limit}
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
    emailQuestionStatus: [String]
    orderStatus: [String]
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
  ${patternInput}
  ${userInput}
  ${userUpdateInput}
  ${productInput}
  ${cartProductInput}
  ${commentInput}
  ${LoginInput}
  ${userRegisterInput}
  ${businessTextInput}
  ${userFilterInput}
  ${userSortInput}
  ${adminConfirmInput}
  ${adminRegisterInput}
  ${modelInput}
  ${contactInput}
  ${orderInputs}
  ${emailQuestionInput}
  ${UserForStatisticsInput}
  ${deliveryInput}
  ${paymentInput}
  ${headerInput}
  ${homePageSlideInput}
  input LanguageInput {
    lang: String!
    value: String
  }
  input CurrencySetInput {
    currency: String!
    value: Float!
  }
  input AddressInput {
    country: String
    region: String
    city: String
    zipcode: String
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
  input MaterialColorInput {
    code: Int!
    name: [LanguageInput!]
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
    size: ID
    bottomMaterial: ID
    description: [LanguageInput!]
    bottomColor: [LanguageInput!]
    availableCount: Int
    additions: [ProductOptionsAdditonalsInput]
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
  input CartProductDimensionsInput {
      volumeInLiters: Int
      weightInKg: Float
  }
  input CartProductBagBottomInput {
      name: [LanguageInput]
      value: String
  }
  input LanguageImageSetInput {
    lang: String!
    value: ImageSetInput
  }
  input MapImage {
    lang: String!
    image: Upload!
  }
  input UserRateInput {
    rate: Int!
  }
  type Mutation {
    uploadFiles(files: [Upload]!): [File]!
    deleteFiles(fileNames: [String]): [String]
    "Pattern Mutations"
    addPattern(pattern: PatternInput!, image: Upload!): PatternResult
    deletePattern(id: ID!): PatternResult
    updatePattern(
      id: ID!
      pattern: PatternInput!
      image: Upload
    ): PatternResult
    "Material Mutation"
    addMaterial(material: MaterialInput!, images: Upload!): MaterialResult
    deleteMaterial(id: ID!): MaterialResult
    updateMaterial(
      id: ID!
      material: MaterialInput!
      images: Upload
    ): MaterialResult
    addMaterialColor(
      id: ID!
      color: MaterialColorInput
      image: Upload
    ): MaterialColorResult
    deleteMaterialColor(id: ID!, code: Int): MaterialResult
    "Category Mutation"
    addCategory(
      category: CategoryInput!
      upload: Upload
    ): CategoryResult
    deleteCategory(
        deleteId: ID!
        switchId: ID!
    ): CategoryResult
    updateCategory(
      id: ID!
      category: CategoryInput!
      upload: Upload
    ): CategoryResult
    "Currency Mutation"
    addCurrency(currency: CurrencyInput!): CurrencyResult
    deleteCurrency(id: ID!): CurrencyResult
    updateCurrency(id: ID!, currency: CurrencyInput!): CurrencyResult
    "News Mutation"
    addNews(news: NewsInput!): NewsResult
    deleteNews(id: ID!): NewsResult
    updateNews(id: ID!, news: NewsInput!): NewsResult
    "User Mutation"
    registerUser(user: userRegisterInput!, language: Int!): User
    registerAdmin(user: AdminRegisterInput!): UserResult
    loginUser(loginInput: LoginInput!): User
    loginAdmin(loginInput: LoginInput!): User
    deleteUser(id: ID!): UserResult
    updateUserById(user: UserUpdateInput!, id: ID!, upload: Upload): User
    updateUserByToken(user: UserInput!): User
    confirmUser(token: String!): Boolean
    confirmUserEmail(token: String!): Boolean
    recoverUser(email: String!, language: Int!): Boolean
    switchUserStatus(id: ID!): LogicalResult!
    resetPassword(password: String!, token: String!): Boolean
    checkIfTokenIsValid(token: String!): Boolean
    sendEmailConfirmation(email: String!, language: Int!): Boolean
    completeAdminRegister(
      user: AdminConfirmInput!
      token: String!
    ): LogicalResult!
      addProductToWishlist(id: ID!, key: String!, productId: ID!): Product!
      removeProductFromWishlist(id: ID!, key: String!, productId: ID!): Product!
      addProductToCart(id: ID!, key: String!, product: CartProductInput!): CartProduct!
      removeProductFromCart(id: ID!, key: String!, product: CartProductInput!): CartProduct!
      changeCartProductQuantity(id: ID!, key: String!, product: CartProductInput!): CartProduct!
       googleUser(idToken: String!, staySignedIn: Boolean): User
    regenerateAccessToken(refreshToken: String!): TokenResult
    "Product Mutation"
    addProduct(product: ProductInput!, upload: Upload!): ProductResult
    deleteProduct(id: ID!): ProductResult
    updateProduct(
      id: ID!
      product: ProductInput!
      upload: Upload
      primary: Upload
    ): ProductResult
    deleteImages(id: ID!, images: [String!]!): PrimaryImage
    "Comment Mutation"
    addComment(productId: ID!, comment: commentInput!): CommentResult
    deleteComment(id: ID!): CommentResult
    updateComment(id: ID!, comment: commentInput!): CommentResult
    "BusinessText Mutation"
    addBusinessText(
      businessText: BusinessTextInput!
      files: [Upload]!
    ): BusinessTextResult
    deleteBusinessText(id: ID!): BusinessTextResult
    updateBusinessText(
      id: ID!
      businessText: BusinessTextInput!
      files: [Upload]!
    ): BusinessTextResult
    "Rate Mutation"
    addRate(product: ID!, userRate: UserRateInput!): ProductResult
    "Model Mutation"
    addModel(model: ModelInput!, upload: Upload): ModelResult
    updateModel(id: ID!, model: ModelInput!, upload: Upload): ModelResult
    deleteModel(id: ID!): ModelResult
    "Contacts Mutation"
    addContact(contact: contactInput!, mapImages: [MapImage]!): ContactResult
    deleteContact(id: ID!): ContactResult
    updateContact(
      id: ID!
      contact: contactInput!
      mapImages: [MapImage]
    ): ContactResult
    "Order Mutation"
    addOrder(order: OrderInput!): OrderResult
    updateOrder(order: OrderInput!): OrderResult
    deleteOrder(id: ID!): OrderResult
    "EmailChat Mutation"
    addEmailQuestion(question: EmailQuestionInput!): EmailQuestion
    deleteEmailQuestions(questionsToDelete: [String]): [EmailQuestion]
    makeEmailQuestionsSpam(
      questionsToSpam: [String]
      adminId: ID!
    ): [EmailQuestion]
    answerEmailQuestion(
      questionId: ID!
      adminId: ID!
      text: String!
    ): EmailQuestionResult
    deleteEmailQuestion(id: ID!): EmailQuestionResult
    makeQuestionSpam(questionId: ID!): EmailQuestionResult
    "HomePageImages Mutation"
    updateHomePageLooksImage(id: ID!, images: Upload): HomepageImagesResult
    addHomePageLooksImage(images: Upload): HomepageImagesResult
    deleteHomePageLooksImage(id: ID!): HomepageImagesResult
    "Header Mutation"
    addHeader(header: HeaderInput!): HeaderResult
    deleteHeader(id: ID!): HeaderResult
    updateHeader(id: ID!, header: HeaderInput!): HeaderResult
    "HomePageSlide Mutation"
    addSlide(slide: HomePageSlideInput!, upload: Upload): HomePageSlideResult
    updateSlide(id: ID!, slide: HomePageSlideInput!, upload: Upload): HomePageSlideResult  
    deleteSlide(id: ID!): HomePageSlideResult  
  }
`;

module.exports = typeDefs;
