const currencyType = `type Currency {
    _id: ID!
    lastUpdatedDate: String!
    convertOptions: [ConvertOption!]
}
`;

const currencyInput = `
    input CurrencyInput {
    lastUpdatedDate: String!
    convertOptions: [ConvertOptionInput!]
    }
    `;

module.exports = { currencyType, currencyInput };
