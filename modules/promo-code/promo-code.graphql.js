const promoCodeType = `
    type PromoCode {
    _id: ID
    dateFrom: Date
    dateTo: Date
    code: String
    discount: Int
    categories: [String]
  }
  type PaginatedPromoCode{
    items: [PromoCode]
    count: Int
  }
`;

const promoCodeInput = `
    input PromoCodeInput {
    dateFrom: Date!
    dateTo: Date!
    code: String!
    discount: Int!
    categories: [String!]!
  }
`;

module.exports = {
  promoCodeType,
  promoCodeInput,
};
