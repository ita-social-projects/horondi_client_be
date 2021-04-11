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
  num ExpressionEnum {
    IS_EQUAL
    IS_NOT_EQUAL
  }
`;

const restrictionInputs = `
  input RestrictionInput {
    
  }

`;
