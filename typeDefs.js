const { gql } = require('apollo-server-express');

const {
  historyType,
  historyFilterInput,
} = require('./modules/history/history.graphql');
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
  resendEmailToConfirmAdminInput,
  confirmSuperadminCreationInput,
  UserForStatisticsInput,
  paginatedUsersType,
  tokenType,
  purchasedProductsType,
  cartType,
  cartInput,
} = require('./modules/user/user.graphql');
const {
  productType,
  productInput,
} = require('./modules/product/product.graphql');
const { orderTypes, orderInputs } = require('./modules/order/order.graphql');
const {
  modelType,
  optionTypes,
  modelInputs,
  modelSortInput,
} = require('./modules/model/model.graphql');
const {
  restrictionTypes,
  expressionEnum,
  restrictionInputs,
} = require('./modules/restriction/restriction.graphql');
const {
  categoryType,
  categoryInput,
  FilterInputComponent,
  SortInputComponent,
  paginatedCategory,
} = require('./modules/category/category.graphql');
const {
  materialType,
  materialInput,
  materialFilterInput,
} = require('./modules/material/material.graphql');
const {
  patternType,
  patternInputs,
  patternFeatureSet,
} = require('./modules/pattern/pattern.graphql');
const {
  currencyType,
  currencyInput,
} = require('./modules/currency/currency.graphql.js');
const {
  commentType,
  commentInput,
  commentsSortInput,
  replyCommentsSortInput,
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
  novaPoshtaType,
  novaPoshtaInput,
} = require('./modules/delivery/nova-poshta/nova-poshta.graphql');
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
const {
  constructorBottomInputs,
  constructorBottomType,
  constructorBottomFeatureSet,
} = require('./modules/constructor/constructor-bottom/constructor-bottom.graphql');
const { headerType, headerInput } = require('./modules/header/header.graphql');
const {
  closureType,
  closureInputs,
  closureFeatureSet,
} = require('./modules/closures/closures.graphql');
const { defaultPaginationParams } = require('./consts');
const { sizeType, sizeInput } = require('./modules/size/size.graphql');
const { colorType, colorInput } = require('./modules/color/color.graphql');
const {
  constructorBasicType,
  constructorBasicInputs,
  constructorBasicFeatureSet,
} = require('./modules/constructor/constructor-basic/constructor-basic.graphgl');
const {
  constructorFrontPocketType,
  constructorFrontPocketInputs,
  constructorFrPocketFeatureSet,
} = require('./modules/constructor/constructor-front-pocket/constructor-front-pocket.graphgl');
const {
  ukrPoshtaEnum,
  ukrPostaType,
} = require('./modules/delivery/ukr-poshta/ukr-poshta.graphql');
const {
  pocketType,
  pocketInputs,
  sideEnum,
  pocketSide,
  pocketSideInput,
} = require('./modules/pocket/pocket.graphql');
const {
  backType,
  backInputs,
  backFeatureSet,
} = require('./modules/back/back.graphql');
const {
  strapType,
  strapFeatureType,
  strapInputs,
} = require('./modules/strap/strap.graphql');
const {
  positionType,
  positionInputs,
} = require('./modules/position/position.graphql');
const {
  bottomType,
  bottomInputs,
  bottomFeatureSet,
} = require('./modules/bottom/bottom.graphql');

const { skip, limit } = defaultPaginationParams;

const typeDefs = gql`
  ${historyType}
	${categoryType}
	${paginatedCategory}
  ${currencyType}
  ${materialType}
  ${newsType}
  ${patternType}
  ${patternFeatureSet}
  ${userType}
  ${paginatedUsersType}
  ${productType}
  ${commentType}
  ${businessTextType}
  ${modelType}
  ${restrictionTypes}
  ${optionTypes}
  ${contactType}
  ${orderTypes}
  ${emailQuestionType}
  ${novaPoshtaType}
  ${ukrPostaType}
  ${paymentType}
  ${paymentStatus}
  ${homePageImagesType}
  ${headerType}
  ${homePageSlideType}
  ${tokenType}
  ${sizeType}
  ${closureType}
  ${closureFeatureSet}
  ${purchasedProductsType}
  ${cartType}
  ${colorType}
  ${constructorBasicType}
  ${constructorBasicFeatureSet}
  ${constructorFrontPocketType}
  ${constructorFrPocketFeatureSet}
  ${constructorBottomType}
  ${constructorBottomFeatureSet}
  ${pocketType}
  ${pocketSide}
  ${backType}
  ${backFeatureSet}
  ${bottomType}
  ${bottomFeatureSet}
  ${strapType}
  ${strapFeatureType}
  ${positionType}
  ${historyFilterInput}
  scalar Upload
  scalar JSONObject
  scalar Date
  enum RoleEnum {
    superadmin
    admin
    user
  }
  enum OptionTypeEnum {
    BACK
    BOTTOM
    CLOSURE
    CONSTRUCTOR_BASIC
    CONSTRUCTOR_BOTTOM
    CONSTRUCTOR_FRONT_POCKET
    PATTERN
    POCKET
    STRAP
    SIDE
  }
  ${sideEnum}
  ${expressionEnum}
  ${ukrPoshtaEnum}
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
    image: String
  }
  type ProductOptions {
    size: Size
    bottomMaterial: Material
    description: [Language]
    bottomColor: Color
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
    countAll: Int
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
  type PaginatedClosure {
      items: [Closure]
      count: Int
  }
  type PaginatedPockets {
    items: [Pocket]
    count: Int
  }
  type PaginatedBacks {
    items: [Back]
    count: Int
  }
  type PaginatedBottoms {
    items: [Bottom]
    count: Int
  }
  type PaginatedStraps {
    items: [Strap]
    count: Int
  }
  type PaginatedRestrictions {
    items: [Restriction]
    count: Int
  }
  type Materials {
    items: [Material]
  }
  type PaginatedConstructorBasics {
      items: [ConstructorBasic]
      count: Int
  }
  type PaginatedConstructorBottom {
      items: [ConstructorBottom]
      count: Int
  }
  type PaginatedConstructorFrontPocket {
      items: [ConstructorFrontPocket]
      count: Int
  }
  type countOrderResult {
    countOrder: Int
  }
  type PaginatedPositions {
    items: [Position]
    count: Int
  }
  union PaginatedProductsResult = PaginatedProducts | Error
  union PaginatedCommentsResult = PaginatedComments | Error
  union CategoryResult = Category | Error
  union CurrencyResult = Currency | Error
  union MaterialResult = Material | Error
  union PatternResult = Pattern | Error
  union NewsResult = News | Error
  union ProductResult = Product | Error
  union CommentResult = Comment | Error
  union BusinessTextResult = BusinessText | Error
  union LogicalResult = SuccessfulResponse | Error
  union ModelResult = Model | Error
  union RestrictionResult = Restriction | Error
  union ContactResult = Contact | Error
  union OrderResult = Order | Error
  union UserResult = User | Error
  union EmailQuestionResult = EmailQuestion | Error
  union HeaderResult = Header | Error
  union HomepageImagesResult = HomePageImages | Error
  union HomePageSlideResult = HomePageSlide | Error
  union TokenResult = Token | Error
  union ClosureResult = Closure | Error
  union SizeResult = Size | Error
  union ColorResult = Color | Error
  union ColorDeletingResult = Color | Materials | Error
  union ConstructorBasicResult = ConstructorBasic | Error
  union ConstructorFrontPocketResult = ConstructorFrontPocket | Error
  union PocketResult = Pocket | Error
  union BackResult = Back | Error
  union BottomResult = Bottom | Error
  union StrapResult = Strap | Error
  
  union HistoryResult = History | Error
  union HistoryRecordResult = HistoryRecord | Error
  union ConstructorBottomResult = ConstructorBottom | Error
  union PositionResult = Position | Error
  type Query {
    getAllHistoryRecords(limit:Int!, skip:Int!, filter:HistoryFilterInput):HistoryResult
    getHistoryRecordById(id:ID!):HistoryRecordResult
    getAllCurrencies: [Currency!]!
    getCurrencyById(id: ID): CurrencyResult
    getAllCategories(
			filter: FilterInputComponent
      pagination: Pagination
			sort: SortInputComponent
			): PaginatedCategory
    getPopularCategories: StatisticDoughnut!
    getCategoriesWithModels: [CategoryWithModels]
    getCategoryById(id: ID): CategoryResult
    getCategoriesForBurgerMenu: [BurgerMenu]
    getAllMaterials(
      limit: Int, 
      skip: Int
      filter: MaterialFilterInput,
    ): PaginatedMaterials!
    getMaterialsByPurpose(purposes: [PurposeEnum]): MaterialByPurpose
    getMaterialById(id: ID): MaterialResult
    getAllPatterns(limit:Int, skip:Int, filter:PatternFilterInput): PaginatedPatterns!
    getPatternById(id: ID): PatternResult
    getAllOrders(limit: Int, skip: Int, filter: OrderFilterInput, sort:JSONObject): PaginatedOrders!
    getOrderById(id: ID): OrderResult
    getUserOrders(pagination: Pagination): [Order!]
    getCountUserOrders(id: ID): countOrderResult
    getCartByUserId(id: ID!): UserResult
    getOrdersStatistic(date: Int!): StatisticDoughnut!
    getPaidOrdersStatistic(date: Int!): StatisticBar!
    getAllNews(limit: Int, skip: Int, filter:NewsFilterInput): PaginatedNews!
    getNewsById(id: ID): NewsResult
    getAllUsers(
      filter: UserFilterInput
      pagination: Pagination
      sort: UserSortInput
    ): PaginatedUsersType!
    getPurchasedProducts(id: ID!): [PurchasedProduct]
    getUsersForStatistic(filter: UserForStatisticsInput): StatisticBar!
    getUserByToken: UserResult
    getUserById(id: ID!): User
    validateConfirmationToken(token: String!): LogicalResult!
    getProductById(id: ID!): ProductResult
    getProductsFilters: ProductsFilter
    getProducts(
      filter: FilterInput
      limit: Int
      skip: Int
      search: String
      sort: SortInput
    ): PaginatedProductsResult!
    getPopularProducts: StatisticBar!
    getAllComments(
      filter: CommentFilterInput,
      pagination: Pagination,
      sort : CommentsSortInput
    ): PaginatedComments!
    getCommentById(id: ID!): CommentResult
    getReplyCommentById(id: ID!): CommentResult
    getCommentsByProduct(
      filter: ProductCommentFilterInput
      pagination: Pagination
      sort : CommentsSortInput
    ): PaginatedCommentsResult
    getReplyCommentsByComment(
      filter: ReplyCommentFilterInput,
      pagination: Pagination,
      sort : ReplyCommentsSortInput
    ): PaginatedCommentsResult
    getRecentComments(limit: Int!): [CommentResult]
    getAllCommentsByUser(userId: ID!): [CommentResult]
    getAllBusinessTexts: [BusinessText]
    getBusinessTextById(id: ID!): BusinessTextResult
    getBusinessTextByCode(code: String!): BusinessTextResult
    getAllModels(filter: ModelFilterInput, pagination: Pagination, sort: ModelSortInput): PaginatedModels
    getModelsByCategory(id: ID!): [ModelResult]
    getModelsForConstructor: [Model]
    getModelById(id: ID!): ModelResult
    getContacts(limit: Int, skip: Int): PaginatedContacts!
    getContactById(id: ID!): ContactResult
    getNovaPoshtaCities(city: String): [NovaPoshtaCity]
    getNovaPoshtaStreets(cityRef: String, street: String): [NovaPoshtaStreet]
    getNovaPoshtaWarehouses(city: String): [NovaPoshtaWarehouse]
    getNovaPoshtaPrices(data: NovaPoshtaPriceInput): [NovaPoshtaPrice]
    getUkrPoshtaRegions: [UkrPoshtaRegion]
    getUkrPoshtaDistrictsByRegionId(id: ID!): [UkrPoshtaDistricts]
    getUkrPoshtaCitiesByDistrictId(id:ID!): [UkrPoshtaCities]
    getUkrPoshtaPostofficesCityId(id:ID!): [UkrPoshtaPostoffices]
    getPaymentCheckout(data: PaymentInput!, language: Int!): OrderResult
    getOrderByPaidOrderNumber(paidOrderNumber: String!): OrderResult
    checkPaymentStatus(orderId: String!): PaymentStatus
    getPaymentRefund(data: PaymentInput): Payment
    getAllEmailQuestions(
      filter: QuestionsFilterInput
      pagination: Pagination
    ): PaginatedEmailQuestion!
    getEmailQuestionById(id: ID!): EmailQuestionResult
    getHomePageLooksImages: [HomePageImages]
    getPendingEmailQuestionsCount: Int
    getAllHeaders: [Header!]!
    getHeaderById(id: ID!): HeaderResult
    getAllSlides(limit: Int, skip: Int): PaginatedHomePageSlides!
    getSlideById(id: ID!): HomePageSlideResult
    getAllSizes(limit: Int, skip: Int, filter:SizeFilterInput): SizeItems
    getSizeById(id: ID!): Size
    getAllClosure(limit:Int, skip:Int, filter:ClosureFilterInput): PaginatedClosure!
    getClosureById(id: ID!): ClosureResult!
    getAllColors: [Color]
    getColorById(id: ID!): ColorResult!
    getAllConstructorBasics(limit: Int, skip: Int, filter: ConstructorBasicFilterInput): PaginatedConstructorBasics!
    getConstructorBasicById(id: ID!): ConstructorBasicResult
    getAllConstructorFrontPocket(limit: Int, skip: Int, filter: ConstructorFrPocketFilterInput): PaginatedConstructorFrontPocket!
    getConstructorFrontPocketById(id: ID!): ConstructorFrontPocketResult  
    getConstructorBottomById(id: ID!): ConstructorBottomResult  
    getAllConstructorBottom(limit: Int, skip: Int, filter: ConstructorBottomFilterInput): PaginatedConstructorBottom!
    getAllPockets(limit:Int!, skip:Int!, filter:PocketFilterInput): PaginatedPockets!
    getPocketById(id: ID): PocketResult
    getPocketsByModel(id: ID): [PocketResult]
    getAllBacks( limit:Int!, skip:Int!, filter:BackFilterInput): PaginatedBacks
    getBackById(id: ID): BackResult
    getBacksByModel(id: ID): [BackResult]
    getAllBottoms( limit:Int!, skip:Int!, filter:BottomFilterInput): PaginatedBottoms
    getBottomById(id: ID): BottomResult
    getAllStraps(limit:Int!, skip:Int!, filter:StrapFilterInput): PaginatedStraps!
    getStrapById(id: ID): StrapResult
    getStrapsByModel(id: ID): [StrapResult]
    getAllRestrictions(limit:Int!, skip:Int!, filter: RestrictionFilterInput): PaginatedRestrictions!
    getRestrictionById(id: ID): RestrictionResult
    getAllPositions(limit:Int, skip:Int, filter:PositionsFilterInput): PaginatedPositions!
    getPositionById(id: ID): PositionResult
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
  input QuestionsFilterInput { 
    search: String,
    emailQuestionStatus: [String], 
    date: DateRangeInput
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
    image: Upload
  }
  ${categoryInput}
  ${currencyInput}
  ${materialInput}
  ${newsInput}
  ${patternInputs}
  ${userInput}
  ${userUpdateInput}
  ${productInput}
  ${cartInput}
  ${commentInput}
  ${commentsSortInput}
  ${replyCommentsSortInput}
  ${LoginInput}
  ${userRegisterInput}
  ${businessTextInput}
	${userFilterInput}
	${userSortInput}
  ${modelSortInput}
	${FilterInputComponent}
	${SortInputComponent}
  ${adminConfirmInput}
  ${adminRegisterInput}
  ${modelInputs}
  ${restrictionInputs}
  ${resendEmailToConfirmAdminInput}
  ${confirmSuperadminCreationInput}
  ${contactInput}
  ${orderInputs}
  ${emailQuestionInput}
  ${UserForStatisticsInput}
  ${novaPoshtaInput}
  ${paymentInput}
  ${headerInput}
  ${sizeInput}
  ${homePageSlideInput}
  ${closureInputs}
  ${colorInput}
  ${materialFilterInput}
  ${constructorBasicInputs}
  ${constructorFrontPocketInputs}
  ${constructorBottomInputs}
  ${pocketInputs}
  ${pocketSideInput}
  ${backInputs}
  ${bottomInputs}
  ${strapInputs}
  ${positionInputs}
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
    addPattern(pattern: PatternInput!, image: Upload): PatternResult
    deletePattern(id: ID!): PatternResult
    updatePattern(
      id: ID!
      pattern: PatternInput!
      image: Upload
    ): PatternResult
    "Material Mutation"
    addMaterial(material: MaterialInput!): MaterialResult
    deleteMaterial(id: ID!): MaterialResult
    updateMaterial(
      id: ID!
      material: MaterialInput!
    ): MaterialResult
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
    addNews(news: NewsInput!, upload: Upload): NewsResult
    deleteNews(id: ID!): NewsResult
    updateNews(id: ID!, news: NewsInput!, upload: Upload): NewsResult
    "User Mutation"
    registerUser(user: userRegisterInput!, language: Int!): User
    addProductToCart(productId: ID!, sizeId: ID!, id: ID!): UserResult
    cleanCart(id: ID!): UserResult
    updateCartItemQuantity(productId:ID!, quantity:Int!, sizeId:ID!, id: ID!): UserResult
    addConstructorProductItemToCart(
    productId: ID!,
    sizeId:ID!,
     constructorData: CartInput!, 
     id: ID!
     ): UserResult
    updateCartConstructorProductItemQuantity(
      quantity: ID!,
      productId: ID!,
      sizeId: ID!,
      constructorData: CartInput!,
      id: ID!
      ): UserResult 
    removeProductItemsFromCart(
      items: RemoveItemsFromCartInput!,
      id: ID!
      ): UserResult
    mergeCartFromLS(
      items:[ CartFromLSInput!],
      id: ID!
      ): UserResult
    registerAdmin(user: AdminRegisterInput!): LogicalResult!
    resendEmailToConfirmAdmin(user: resendEmailToConfirmAdminInput!): LogicalResult!
    confirmSuperadminCreation(user: confirmSuperadminCreationInput!): LogicalResult!
    loginUser(loginInput: LoginInput!): User
    loginAdmin(loginInput: LoginInput!): User
    deleteUser(id: ID!): UserResult
    blockUser(userId: ID!): UserResult
    unlockUser(userId: ID!): UserResult
    updateUserById(user: UserUpdateInput!, id: ID!, upload: Upload): User
    updateUserByToken(user: UserInput!): User
    confirmUser(token: String!): Boolean
    confirmUserEmail(token: String!): UserConfirmed
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
    addComment(id:ID,comment: CommentInput!): CommentResult
    replyForComment(id:ID,commentId: ID!, replyCommentData:ReplyCommentInput!): CommentResult
    deleteComment(id: ID,commentID:ID!): CommentResult
    deleteReplyForComment(id:ID,replyCommentId: ID!): CommentResult
    updateComment(id: ID!, comment: CommentUpdateInput!): CommentResult
    updateReplyForComment(replyCommentId: ID!, replyCommentData: ReplyCommentUpdateInput!): CommentResult
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
    regenerateOrderNumber(id:ID!):OrderResult
    updateOrder(order: OrderInput!, id: ID!): OrderResult
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
    "Closure Mutation"
    addClosure(closure: ClosureInput!, images: Upload): ClosureResult
    updateClosure(id: ID!, closure: ClosureInput!, image: Upload): ClosureResult  
    deleteClosure(id: ID!): ClosureResult  
    "Sizes Mutation"
    addSize(size: SizeInput!): SizeResult!
    deleteSize(id: ID!): SizeResult!
    updateSize(id: ID!, size: SizeInput!): SizeResult!
    "Color Mutation"
    addColor(data: ColorInput!): ColorResult!
    deleteColor(id: ID!): ColorDeletingResult!
    "ConstructorBasic Mutation"  
    addConstructorBasic(constructorElement: ConstructorBasicInput!, upload: Upload): ConstructorBasicResult
    updateConstructorBasic(id: ID!, constructorElement: ConstructorBasicInput!, upload: Upload): ConstructorBasicResult
    deleteConstructorBasic(id: ID!): ConstructorBasicResult
    "ConstructorFrontPocket Mutation"  
    addConstructorFrontPocket(constructorElement: ConstructorFrontPocketInput!, upload: Upload): ConstructorFrontPocketResult
    updateConstructorFrontPocket(id: ID!, constructorElement: ConstructorFrontPocketInput!, upload: Upload): ConstructorFrontPocketResult
    deleteConstructorFrontPocket(id: ID!): ConstructorFrontPocketResult
    "ConstructorBottom Mutation"
    addConstructorBottom(constructorElement: ConstructorBottomInput!, upload: Upload): ConstructorBottomResult
    updateConstructorBottom(id: ID!, constructorElement: ConstructorBottomInput!, upload: Upload): ConstructorBottomResult
    deleteConstructorBottom(id: ID!): ConstructorBottomResult
    "Change model constructor details"  
    addModelConstructorBasic(id:ID!, constructorElementID:ID!):ModelResult
    deleteModelConstructorBasic(id:ID!, constructorElementID:ID!):ModelResult
    addModelConstructorPattern(id:ID!, constructorElementID:ID!):ModelResult
    deleteModelConstructorPattern(id:ID!, constructorElementID:ID!):ModelResult
    addModelConstructorFrontPocket(id:ID!, constructorElementID:ID!):ModelResult
    deleteModelConstructorFrontPocket(id:ID!, constructorElementID:ID!):ModelResult
    addModelConstructorBottom(id:ID!, constructorElementID:ID!):ModelResult
    deleteModelConstructorBottom(id:ID!, constructorElementID:ID!):ModelResult 
    "Pocket Mutation"
    addPocket(pocket: PocketInput!, images: Upload):PocketResult
    updatePocket(id: ID, pocket: PocketInput!, image: Upload):PocketResult
    deletePocket(id: ID):PocketResult
    "Back Mutation"
    addBack(back: BackInput!, image: Upload):BackResult
    updateBack(id: ID, back: BackInput!, image: Upload):BackResult
    deleteBack(id: ID):BackResult
    "Bottom Mutation"
    addBottom(bottom: BottomInput!, image: Upload):BottomResult
    updateBottom(id: ID, bottom: BottomInput!, image: Upload):BottomResult
    deleteBottom(id: ID):BottomResult
    "Strap Mutation"
    addStrap(strap: StrapInput!, image: Upload): StrapResult
    updateStrap(id: ID, strap: StrapInput!, image: Upload):StrapResult
    deleteStrap(id: ID):StrapResult
    "Restriction Mutation"
    addRestriction(restriction: RestrictionInput!): RestrictionResult
    updateRestriction(id: ID, restriction: RestrictionInput!): RestrictionResult
    deleteRestriction(id: ID): RestrictionResult
    addPosition(position: PositionInput!): PositionResult 
    deletePosition(id: ID):PositionResult
    updatePosition(id: ID, position: PositionInput!): PositionResult
  }
`;

module.exports = typeDefs;
