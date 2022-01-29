const certificateTypes = `
  type Certificate {
    _id: ID!
    name: String!
    value: Int!
    createdBy: User
    ownedBy: User
    email: String
    isUsed: Boolean
    isActivated: Boolean!
    isExpired: Boolean
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

  input GenerateCertificateInput {
    value: Int!
    email: String
    isActivated: Boolean
    dateStart: Date
    dateEnd: Date
  }

  union CertificateResult = Certificate | Error 
  union CertificatePaginatedResult = PaginatedCertificate | Error

  extend type Query {
    getAllCertificates(limit:Int, skip:Int): CertificatePaginatedResult
    getCertificateById(id: ID!): CertificateResult
  }

  extend type Mutation {
    addCertificate(name: String!): CertificateResult
    deleteCertificate(id: ID!): CertificateResult
    generateCertificate (newCertificate: GenerateCertificateInput!): CertificateResult
    updateCertificate(name: String!): CertificateResult
  }
`;

module.exports = { certificateTypes };
