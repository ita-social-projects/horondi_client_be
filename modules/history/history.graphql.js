const historyType = `
    type History {
      items: [HistoryRecord],
      count: Int
    }
    type HistoryRecord{
        _id: ID!
        action: String,
        historyName: String,
        subject: HistorySubject
        valueBeforeChange: [JSONObject],
        valueAfterChange: [JSONObject]
        userId: User
        createdAt: Date
    }
    type HistorySubject {
        model: String
        name: String,
        subjectId: ID
     }
  `;
const historyFilterInput = `
  input HistoryFilterInput{
    date:DateRangeInput
    action:[String]
    historyName:[String]
    fullName:String
    role:[String]
  }
  
  input DateRangeInput{
    dateFrom: Date
    dateTo: Date
  }
`;

module.exports = { historyType, historyFilterInput };
