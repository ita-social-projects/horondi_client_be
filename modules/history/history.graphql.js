const historyType = `
    type History {
      items: [HistoryRecord],
      count: Int
    }
    type HistoryRecord{
        _id: ID!
        action: String,
        subject: HistorySubject
        valueBeforeChange: [String],
        valueAfterChange: [String]
        userId: User
        createdAt: Date
    }
    type HistorySubject {
        model: String
        name: String,
        subjectId: ID
     }
  `;
module.exports = { historyType };
