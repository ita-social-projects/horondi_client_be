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

  type Certificates {
    certificates: [Certificate]
    count: Int
    paymentUrl: String,
    paymentToken: String
    paymentStatus: String
    certificatesOrderId: String
  }

  input GenerateCertificateInput {
    value: Int!
    email: String
    count: Int!
    isActivated: Boolean
    dateStart: Date
    dateEnd: Date
  }

  union CertificateResult = Certificate | Error 
  union CertificatesResult = Certificates | Error
  union CertificatePaginatedResult = PaginatedCertificate | Error

  extend type Query {
    getAllCertificates(limit:Int, skip:Int): CertificatePaginatedResult
    getCertificateById(id: ID!): CertificateResult
  }

  extend type Mutation {
    addCertificate(name: String!): CertificateResult
    deleteCertificate(id: ID!): CertificateResult
    generateCertificate (newCertificate: GenerateCertificateInput!): CertificatesResult
    updateCertificate(name: String!): CertificateResult
  }
`;

module.exports = { certificateTypes };
