const certificateType = `
type Certificate {
_id: ID
name: String
value: Int
status: String
}
`;

/* startDate: Date
endDate: Date
user: User */
const certificateInput = `
  input CertificateInput {
    name: String
    value: Int
    status: String
  }
`;

module.exports = {
  certificateType,
  certificateInput,
};
