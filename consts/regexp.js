const emailRegExp = new RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/i);
const numberRegExp = new RegExp(/^[+]*[(]?\d{1,4}[)]?[-\s/0-9]{9}$/);
const uaLanguageRegExp = new RegExp(/^[а-яїієґ0-9\s]+$/i);
const enLanguageRegExp = new RegExp(/^[a-z0-9\s]+$/i);
const userNameRegExp = /^(?=.{2,30}$)[a-zA-Zа-яА-ЯІЄЇіїє]+(([',. -][a-zA-Zа-яА-ЯІЄЇіїє])?[a-zA-Zа-яА-ЯІЄЇіїє])*$/u;
const passwordRegExp = /^(?=.*[A-ZА-ЯІЇЄ])(?=.*\d)[a-zA-Zа-яА-ЯіїєІЇЄ\d!@#$%^&*()~¥=_+}{":;'?/>.<,\\`|[\]-]{6,30}$/;
const zipcodeRegExp = /^\d{5}(?:[-\s]\d{4})?$/;
const certificateRegExp = /^HOR\d{6}$/i;

module.exports = {
  emailRegExp,
  numberRegExp,
  uaLanguageRegExp,
  enLanguageRegExp,
  userNameRegExp,
  passwordRegExp,
  zipcodeRegExp,
  certificateRegExp,
};
