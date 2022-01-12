const certificateType = `
type Certificate {
_id: ID!
createdBy: ID!
name: String!
value: Int!
isUsed: Boolean!
isActive: Boolean!
dateStart: Date
dateEnd: Date
}
`;

const certificateInput = `
  input CertificateInput {
    name: String
    value: Int
    isUsed: Boolean
  }
`;

module.exports = {
  certificateType,
  certificateInput,
};
