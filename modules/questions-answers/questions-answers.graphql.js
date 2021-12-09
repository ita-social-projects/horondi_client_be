const questionsAnswersType = `
    type QuestionsAnswers {
    _id: ID
    question: [Language]
    answer: [Language]
    translationsKey: ID
}
`;

const questionsAnswersInput = `
    input QuestionsAnswersInput {
    question: [LanguageInput]
    answer: [LanguageInput]
    }`;

module.exports = { questionsAnswersType, questionsAnswersInput };
