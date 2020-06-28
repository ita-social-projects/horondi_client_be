const currencyType = `type Currency {
    _id: ID!
    date: String
    convertOptions: [ConvertOption]
}
`;

const currencyInput = `
    input CurrencyInput {
    date: String
    convertOptions: [ConvertOptionInput]
    }
    `;

module.exports = { currencyType, currencyInput };
