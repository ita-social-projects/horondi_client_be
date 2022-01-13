const { gql } = require('@apollo/client');

const getAllHistoryRecords = async (params, operations) => {
  const allRecords = await operations.query({
    query: gql`
      query($limit: Int!, $skip: Int!, $filter: HistoryFilterInput) {
        getAllHistoryRecords(limit: $limit, skip: $skip, filter: $filter) {
          ... on History {
            items {
              _id
              action
              subject {
                model
                name
                subjectId
              }
              valueBeforeChange
              valueAfterChange
              createdAt
            }
            count
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: params,
  });
  return allRecords.data.getAllHistoryRecords;
};

const getHistoryRecordById = async (id, operations) => {
  const record = await operations.query({
    query: gql`
      query($id: ID!) {
        getHistoryRecordById(id: $id) {
          ... on HistoryRecord {
            _id
            action
            subject {
              model
              name
              subjectId
            }
            valueBeforeChange
            valueAfterChange
            createdAt
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: { id },
  });
  return record.data.getHistoryRecordById;
};

module.exports = {
  getAllHistoryRecords,
  getHistoryRecordById,
};
