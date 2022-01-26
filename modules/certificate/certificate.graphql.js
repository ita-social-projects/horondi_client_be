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
    isActive: Boolean @deprecated(reason: "use isActivated and isExpired fields.")
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

  extend type Query {
    getAllCertificates(limit:Int, skip:Int): PaginatedCertificate!
    getCertificateById(id: ID!): CertificateResult
  }

  extend type Mutation {
    generateCertificate (newCertificate: GenerateCertificateInput!): CertificateResult
    addCertificate(name: String!): CertificateResult
    deleteCertificate(id: ID!): CertificateResult
    updateCertificate(name: String!): CertificateResult
  }
`;

module.exports = { certificateTypes };
