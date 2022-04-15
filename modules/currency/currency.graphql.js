const currencyType = `type Currency {
    _id: ID!
    lastUpdatedDate: String!
    convertOptions: ConvertOptions!
}
`;

const currencyInput = `
    input CurrencyInput {
        lastUpdatedDate: String! 
        convertOptions: ConvertOptionsInput!
    }
`;

const convertOptionsTypes = `
    type ConvertOptions {
        UAH: ConvertOption!
        USD: ConvertOption!
    }

    type ConvertOption {
        name: String
        exchangeRate: Float
        unicode: String
    }
`;

const convertOptionsInputs = `
    input ConvertOptionsInput {
        UAH: ConvertOptionInput!
        USD: ConvertOptionInput!
    }

    input ConvertOptionInput {
        name: String!
        exchangeRate: Float!
        unicode: String!
    }
`;

module.exports = {
  currencyType,
  currencyInput,
  convertOptionsTypes,
  convertOptionsInputs,
};
