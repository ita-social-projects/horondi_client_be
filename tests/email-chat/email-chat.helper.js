const { gql } = require('@apollo/client');

const getAllEmailQuestions = async (filter, pagination, operations) => {
  const res = await operations.mutate({
    query: gql`
      query($filter: QuestionsFilterInput, $pagination: Pagination) {
        getAllEmailQuestions(filter: $filter, pagination: $pagination) {
          questions {
            _id
            senderName
            text
            date
            email
            status
            language
            answer {
              date
              text
            }
          }
          count
        }
      }
    `,
    variables: {
      filter,
      pagination,
    },
  });
  return res.data.getAllEmailQuestions;
};

const getPendingEmailQuestionsCount = async (operations) => {
  const res = await operations.mutate({
    query: gql`
      query {
        getPendingEmailQuestionsCount
      }
    `,
  });
  return res.data.getPendingEmailQuestionsCount;
};

const getEmailQuestionById = async (id, operations) => {
  const res = await operations.mutate({
    query: gql`
      query($id: ID!) {
        getEmailQuestionById(id: $id) {
          ... on EmailQuestion {
            _id
            senderName
            text
            date
            email
            status
            language
            answer {
              date
              text
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return res.data.getEmailQuestionById;
};

const addEmailQuestion = async (question, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($question: EmailQuestionInput!) {
        addEmailQuestion(question: $question) {
          _id
          senderName
          text
          date
          email
          status
          language
        }
      }
    `,
    variables: {
      question,
    },
  });
  return res.data.addEmailQuestion;
};

const makeEmailQuestionsSpam = async (questionsToSpam, adminId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($questionsToSpam: [String], $adminId: ID!) {
        makeEmailQuestionsSpam(
          questionsToSpam: $questionsToSpam
          adminId: $adminId
        ) {
          _id
          senderName
          text
          date
          email
          status
          language
          answer {
            date
            text
          }
        }
      }
    `,
    variables: {
      questionsToSpam,
      adminId,
    },
  });
  return res.data.makeEmailQuestionsSpam;
};

const answerEmailQuestion = async (questionId, adminId, text, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($questionId: ID!, $adminId: ID!, $text: String!) {
        answerEmailQuestion(
          questionId: $questionId
          adminId: $adminId
          text: $text
        ) {
          ... on EmailQuestion {
            _id
            senderName
            text
            date
            email
            status
            language
            answer {
              date
              text
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      questionId,
      adminId,
      text,
    },
  });
  return res.data.answerEmailQuestion;
};

const deleteEmailQuestions = async (questionsToDelete, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($questionsToDelete: [String]) {
        deleteEmailQuestions(questionsToDelete: $questionsToDelete) {
          _id
          senderName
          text
          date
          email
          status
          language
          answer {
            date
            text
          }
        }
      }
    `,
    variables: {
      questionsToDelete,
    },
  });
  return res.data.deleteEmailQuestions;
};

module.exports = {
  getAllEmailQuestions,
  getPendingEmailQuestionsCount,
  getEmailQuestionById,
  addEmailQuestion,
  makeEmailQuestionsSpam,
  answerEmailQuestion,
  deleteEmailQuestions,
};
