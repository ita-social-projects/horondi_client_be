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
    inProgress: Boolean
    dateStart: Date
    dateEnd: Date
    paymentStatus: String
    paymentUrl: String
    paymentToken: String
    admin: [Admin]
  }

  type Admin{
    firstName: String
    lastName: String
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
    name: String
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

  enum Sort {
    asc
    desc
  }

  extend type Query {
    getAllCertificates(limit: Int, skip: Int, sortBy: String, sortOrder: Sort, search: String, status: [String]): CertificatePaginatedResult
    getCertificateById(id: ID!): CertificateResult
    getCertificateByParams(params: CertificateInput!): CertificateResult,
    getAllUserCertificates(limit: Int, skip: Int):CertificatePaginatedResult
  }

  extend type Mutation {
    addCertificate(name: String!): CertificateResult
    deleteCertificate(id: ID!): CertificateResult
    generateCertificate (newCertificates: [GenerateCertificateInput]!, email: String, dateStart: Date ): CertificatesResult
    updateCertificate(params: CertificateInput!, statusUpdate: String): CertificateResult
	 giftCertificateToEmail(id: ID!, email: String!, oldEmail: String!, language: Int!): CertificateResult
  }
`;

module.exports = { certificateTypes };
