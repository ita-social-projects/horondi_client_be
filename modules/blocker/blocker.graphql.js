const blockerType = `
  type Blocker {
    id: ID!
    name: String
    optionId: [Pocket]
  }
`;

const blockerInput = `
  input BlockerInput {
    name: String
    optionId: ID
  }
`;

module.exports = {
  blockerType,
  blockerInput,
};
