const restrictionTypes = `
  type Restriction {
    _id: ID
    compareByExpression: ExpressionEnum
    options: [BlockedItem]
  }

  type BlockedItem {
    option: ID
    feature: ID
  }

`;

const expressionEnum = `
  enum ExpressionEnum {
    IS_EQUAL
    IS_NOT_EQUAL
  }
`;

const restrictionInputs = `
  input RestrictionInput {
    compareByExpression: String
    options: [BlockedItemInput]
  }

  input BlockedItemInput {
    option: ID
    feature: ID
  }

`;

module.exports = {
  restrictionTypes,
  expressionEnum,
  restrictionInputs,
};
