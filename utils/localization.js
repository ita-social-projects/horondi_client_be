const { getTime } = require('./getTime');

const emailQuestionAnswerMessage = (question, language) => {
  const date = getTime(question.date);

  if (language === 0) {
    return `
  <div style="
  padding: 50px 20px;
    font-family: Helvetica
  ">
    <h1 style="margin-left: 20px; 
    color: black">HORONDI</h1>
    <p style="
    margin: 0;
    color: black
    ">
      Привіт, ${question.senderName}. Ви залишили запитання ${
  date.includes(':') ? 'о' : ''
} ${date}
    </p>
        <p style="
        margin: 10px 0 0; 
    color: black
    ">
      Зміст питання: <blockquote style="color: black">${
  question.text
}</bloquete>
    </p>
        </p>
        <p style="
         margin: 0 0 10px;
         color: black
    ">
      Відповідь: <blockquote style="color: black">${
  question.answer.text
}</bloquete>
    </p>
    <p style="margin: 0; color: black">Якщо Ви не залишали цього запитання - проігноруйте цей лист.</p>
    <p style="margin: 0;  color: black">З найкращими побажаннями, команда HORONDI</p>
  </div>
`;
  }

  return `
  <div style="
  padding: 50px 20px;
      font-family: Helvetica
  ">
    <h1 style="margin-left: 20px; color: black">HORONDI</h1>
    <p style="
    margin: 0; 
    color: black
    ">
      Hello, ${question.senderName}. You left a question ${
  date.includes(':') ? 'at' : ''
} ${date}
    </p>
        <p style="
        margin: 10px 0 0; 
     color: black
    ">
      Contents of the question: <blockquote style="color: black">${
  question.text
}</bloquete>
    </p>
        </p>
        <p style="
     margin: 0 0 10px;
      color: black
    ">
      Answer: <blockquote style="color: black">${
  question.answer.text
}</bloquete>
    </p>
    <p style="margin: 0;  color: black">If you have not left a question - please, ignore this email.</p>
    <p style="margin: 0;  color: black">Best regards, HORONDI team.</p>
  </div>
`;
};

module.exports = {
  emailQuestionAnswerMessage,
};
