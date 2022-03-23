const certificateTypes = `
  type Certificate {
    _id: ID!
    name: String
    value: Int!
    createdBy: User
    ownedBy: User
    email: String
    isUsed: Boolean
    isActivated: Boolean
    isExpired: Boolean
    dateStart: Date
    dateEnd: Date
    paymentStatus: String,
    paymentUrl: String
    paymentToken: String
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
    certificatesPrice: Int
  }

  input CertificateInput {
    _id: ID
    name: String!
    dateEnd: String
    dateStart: String
    email: String
    paymentStatus: String
    value: Int
  }

  input GenerateCertificateInput {
    value: Int!
    count: Int!
  }

  union CertificateResult = Certificate | Error 
  union CertificatesResult = Certificates | Error
  union CertificatePaginatedResult = PaginatedCertificate | Error

  extend type Query {
    getAllCertificates(limit: Int, skip: Int, sort: JSONObject, search: String): CertificatePaginatedResult
    getCertificateById(id: ID!): CertificateResult
  }

  extend type Mutation {
    addCertificate(name: String!): CertificateResult
    deleteCertificate(id: ID!): CertificateResult
    generateCertificate (newCertificates: [GenerateCertificateInput]!, email: String, dateStart: Date ): CertificatesResult
    updateCertificate(name: String!): CertificateResult
  }
`;

module.exports = { certificateTypes };
