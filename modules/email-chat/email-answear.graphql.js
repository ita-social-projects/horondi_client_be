const emailAnswearType = `
type EmailAnswear {
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
  emailAnswearInput,
};
