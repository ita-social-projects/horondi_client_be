const recoveryMessage = (firstName, token, language) => {
  if (language === 0) {
    return `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: Montserrat sans-serif;
    line-height: 2;
    font-size: 1.1rem;
  ">
    <h2>Привіт, ${firstName}!</h2>
    <p>Для відновлення паролю, будь ласка, перейдіть за посиланням нижче:</p>
    <a href=${process.env.FRONT_BASE_URI}recovery/${token}>Відновити пароль</a> 
    <p>Якщо ви не подавали заявку на відновлення - проігноруйте це повідомлення.</p>
    <p>З найкращимим побажаннями, команда HORONDI.</p>
  </div>
`;
  }
  return `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: Montserrat sans-serif;
    line-height: 2;
    font-size: 1.1rem;
  ">
    <h2>Hello, ${firstName}!</h2>
    <p>To reset your password, please follow the link below:</p>
    <a href=${process.env.FRONT_BASE_URI}recovery/${token}>Reset password</a>
    <p>If you did not request a password reset, please ignore this message.</p>
    <p>Best regards, HORONDI team.</p>
  </div>
`;
};

const confirmationMessage = (firstName, token, language) => {
  if (language === 0) {
    return `
  <div className="email" style="
    padding: 20px;
    font-family: Montserrat sans-serif monospace;
    line-height: 2;
    font-size: 1.1rem;
  ">
    <h2>Hello, ${firstName}</h2>
    <p>Для завершення реєстрації, будь ласка, перейдіть за посиланням нижче:</p>
    <a style="color: black"  href=${process.env.FRONT_BASE_URI}confirmation/${token}>Підтвердити електронну пошту</a>
    <p>Якщо ви не реєструвались - проігноруйте це повідомлення.</p>
    <p>З найкращими побажаннями, команда HORONDI</p>
  </div>
`;
  }

  return `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: Montserrat sans-serif;
    line-height: 2;
    font-size: 1.1rem;
  ">
    <h2>Hello, ${firstName} !</h2>
    <p>To complete the registration, please follow the link below:</p>
    <a style="color: black" href=${process.env.FRONT_BASE_URI}confirmation/${token}>Confirm email</a> 
    <p>If you did not register = ignore this message</p>
    <p>Best regards, HORONDI team.</p>
  </div>
`;
};

module.exports = {
  confirmationMessage,
  recoveryMessage,
};
