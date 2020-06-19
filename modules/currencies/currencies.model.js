const currencyType = `    
    _id: ID!
    date: String!
    convertOptions: [ConvertOption!]
`;

const currencyInput = ` 
    date: String!
    convertOptions: [ConvertOptionInput!]
`;

module.exports = { currencyType, currencyInput };
