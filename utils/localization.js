const recoveryMessage = (firstName, token, language) => {
  if (language === 0) {
    return `
  <div style="
background-color:  #3F3F3F;
height: 450px;
padding-top: 100px;
">
  <div style="
  background-color: white;
  width: 553px;
  height: 140px;
  margin: 28px 88px;
  padding: 52px 45px;
  font-family: Helvetica
  ">
    <p style="
    margin: 0px
    ">
      Для відновлення паролю, будь ласка, перейдіть за посиланням нижче:
    </p>
    <a style="color: black; margin: 0px"  href=${process.env.FRONT_BASE_URI}recovery/${token}>Відновити пароль</a>
    <p style="margin-bottom: 45px">Якщо ви не подавали заявку на відновлення - проігноруйте це повідомлення.</p>
    <p>З найкращимим побажаннями, команда HORONDI.</p>
  </div>
</div>
`;
  }
  return `
<div style="
background-color:  #3F3F3F;
height: 450px;
padding-top: 100px;
">
  <div style="
  background-color: white;
  width: 553px;
  height: 140px;
  margin: 28px 88px;
  padding: 52px 45px;
  font-family: Helvetica
  ">
    <p style="
    margin: 0px
    ">
      To reset your password, please follow the link below:
    </p>
    <a style="color: black; margin: 0px"  href=${process.env.FRONT_BASE_URI}recovery/${token}>Reset password</a>
    <p style="margin-bottom: 45px">If you did not request a password reset, please ignore this message.</p>
    <p>Best regards, HORONDI team.</p>
  </div>
</div>
`;
};

const confirmationMessage = (firstName, token, language) => {
  if (language === 0) {
    return `
<div style="
background-color:  #3F3F3F;
height: 450px;
padding-top: 100px;
">
  <div style="
  background-color: white;
  width: 553px;
  height: 140px;
  margin: 28px 88px;
  padding: 52px 45px;
  font-family: Helvetica
  ">
    <p style="
    margin: 0px
    ">
      Для завершення реєстрації, будь ласка, перейдіть за посиланням нижче:
    </p>
    <a style="color: black; margin: 0px"  href=${process.env.FRONT_BASE_URI}confirmation/${token}>Підтвердити електронну пошту</a>
    <p style="margin-bottom: 45px">Якщо ви не реєструвались - проігноруйте це повідомлення.</p>
    <p>З найкращими побажаннями, команда HORONDI</p>
  </div>
</div>
`;
  }

  return `
<div style="
background-color:  #3F3F3F;
height: 450px;
padding-top: 100px;
">
  <div style="
  background-color: white;
  width: 553px;
  height: 140px;
  margin: 28px 88px;
  padding: 52px 45px;
  font-family: Helvetica
  ">
    <p style="
    margin: 0px
    ">
      To complete the registration, please follow the link below:
    </p>
    <a style="color: black; margin: 0px" href=${process.env.FRONT_BASE_URI}confirmation/${token}>Confirm email</a> 
    <p style="margin-bottom: 45px">If you did not register - ignore this message</p>
    <p>Best regards, HORONDI team.</p>
  </div>
`;
};

const adminConfirmationMessage = token => {
  return `
<div style="
background-color:  #3F3F3F;
height: 450px;
padding-top: 100px;
">
<div style="
background-color: white;
width: 553px;
height: 200px;
margin: 28px 88px;
padding: 22px 45px;
font-family: Helvetica
">
<h2 style="
margin: 20px 0
">
Реєстрація адміністратора.
</h2>
<p style="
margin: 0px
">
Щоб зареєструватись як адміністратор, перейдіть за посиланням нижче:
</p>
<a style="color: white;
text-decoration: none;
background-color: gray;
padding: 6px 12px;
margin: 0px;
display: inline-block;
margin-top: 8px;margin-bottom: 40px"
href=${process.env.ADMIN_BASE_URI}confirmation/${token}>Перейти за посиланням</a>
<p>З найкращимим побажаннями, команда HORONDI.</p>
</div>
</div>
`;
};

module.exports = {
  confirmationMessage,
  recoveryMessage,
  adminConfirmationMessage,
};
