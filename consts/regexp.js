const emailRegExp = new RegExp(
  /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
);
const numberRegExp = new RegExp(/^\+?3?8?(0\d{9})$/);
const uaLanguageRegExp = new RegExp(/^[а-яїієґ0-9\s]+$/i);
const enLanguageRegExp = new RegExp(/^[a-z0-9\s]+$/i);
const userNameRegExp = /^(?=.{2,30}$)[a-zA-Zа-яА-ЯІЄЇіїє]+(([',. -][a-zA-Zа-яА-ЯІЄЇіїє])?[a-zA-Zа-яА-ЯІЄЇіїє]*)*$/u;
const passwordRegExp = /^(?=.*[a-zA-Zа-яА-Яіїє])^(?=.*[A-ZА-ЯІЇЄ])(?=.*\d)[a-zA-Zа-яА-ЯіїєІЇЄ\d]{6,30}$/;
const zipcodeRegExp = /^\d{5}(?:[-\s]\d{4})?$/;

module.exports = {
  emailRegExp,
  numberRegExp,
  uaLanguageRegExp,
  enLanguageRegExp,
  userNameRegExp,
  passwordRegExp,
  zipcodeRegExp,
};
