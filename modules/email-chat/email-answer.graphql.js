const emailAnswerType = `
type EmailAnswer {
  admin: User!
  date: String!
  text: String!
}
`;

// const emailAnswerInput = `
// input EmailAnswerInput {
//     text: String!
// }`;

module.exports = {
  emailAnswerType,
  // emailAnswerInput,
};
