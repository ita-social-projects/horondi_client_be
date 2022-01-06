const promoCodeType = `
    type PromoCode {
    _id: ID
    dateFrom: String
    dateTo: String
    code: String
    discount: Int
  }
  type PaginatedPromoCode{
    items: [PromoCode]
    count: Int
  }
`;

const promoCodeInput = `
    input PromoCodeInput {
    dateFrom: String
    dateTo: String
    code: String
    discount: Int
  }
`;

module.exports = {
  promoCodeType,
  promoCodeInput,
};
