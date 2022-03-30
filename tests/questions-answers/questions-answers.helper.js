const { gql } = require('@apollo/client');

const addQuestionsAnswers = async (questionsAnswers, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($questionsAnswers: QuestionsAnswersInput!) {
        addQuestionsAnswers(questionsAnswers: $questionsAnswers) {
          ... on QuestionsAnswers {
            _id
            question {
              value
              lang
            }
            answer {
              value
              lang
            }
          }
        }
      }
    `,
    variables: {
      questionsAnswers,
    },
  });

  return res.data.addQuestionsAnswers;
};

const deleteQuestionsAnswers = async (id, operations) =>
  operations.mutate({
    mutation: gql`
      mutation ($id: ID!) {
        deleteQuestionsAnswers(id: $id) {
          ... on QuestionsAnswers {
            _id
            question {
              value
              lang
            }
            answer {
              value
              lang
            }
          }
        }
      }
    `,
    variables: { id },
  });

const getAllQuestionsAnswers = async operations => {
  const res = await operations.query({
    query: gql`
      query {
        getAllQuestionsAnswers {
          items {
            _id
            question {
              lang
              value
            }
            answer {
              lang
              value
            }
            translationsKey
          }
        }
      }
    `,
  });

  return res.data.getAllQuestionsAnswers;
};
const getQuestionsAnswersById = async (id, operations) => {
  const res = await operations.query({
    query: gql`
      query ($id: ID!) {
        getQuestionsAnswersById(id: $id) {
          ... on QuestionsAnswers {
            question {
              value
              lang
            }
            answer {
              lang
              value
            }
          }
        }
      }
    `,
    variables: { id },
  });

  return res.data.getQuestionsAnswersById;
};

const updateQuestionsAnswers = async (id, questionsAnswers, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $questionsAnswers: QuestionsAnswersInput!) {
        updateQuestionsAnswers(id: $id, questionsAnswers: $questionsAnswers) {
          ... on QuestionsAnswers {
            _id
            question {
              value
              lang
            }
            answer {
              value
              lang
            }
          }
        }
      }
    `,
    variables: {
      id,
      questionsAnswers,
    },
  });

  return res.data.updateQuestionsAnswers;
};

module.exports = {
  addQuestionsAnswers,
  deleteQuestionsAnswers,
  getAllQuestionsAnswers,
  getQuestionsAnswersById,
  updateQuestionsAnswers,
};
