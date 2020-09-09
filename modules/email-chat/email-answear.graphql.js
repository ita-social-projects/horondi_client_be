const emailAnswearType = `
type EmailAnswear {
  _id: ID!
  admin: User!
  date: String!
  text: String!
}
`;

const emailAnswearInput = `
input EmailAnswearInput {
    admin: ID!
    date: String!
    text: String!
}`;

module.exports = {
    emailAnswearType,
    emailAnswearInput
};







