const questionsAnswersType = `
    type QuestionsAnswers {
    id: ID
    question: String
    answer: String
    translationsKey: ID
}
`;

const questionsAnswersInput = `
    input QuestionsAnswersInput {
    question: String
    answer: String
    }`;

module.exports = { questionsAnswersType, questionsAnswersInput };
