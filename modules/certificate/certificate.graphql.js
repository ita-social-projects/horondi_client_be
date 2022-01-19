const certificateTypes = `
  type Certificate {
    _id: ID!
    createdBy: User
    name: String!
    value: Int!
    isUsed: Boolean!
    isActive: Boolean!
    dateStart: Date
    dateEnd: Date
  }
  
  type PaginatedCertificate {
      items: [Certificate]
      count: Int
  }

  input CertificateInput {
    name: String
    value: Int
    isUsed: Boolean
  }
  
  union CertificateResult = Certificate | Error

  extend type Query {
    getAllCertificates(limit:Int, skip:Int): PaginatedCertificate!
    getCertificateById(id: ID!): CertificateResult
  }

  extend type Mutation {
    addCertificate(certificate: CertificateInput!): CertificateResult
    deleteCertificate(id: ID!): CertificateResult
    updateCertificate(name: String!): CertificateResult
  }
`;

module.exports = { certificateTypes };
