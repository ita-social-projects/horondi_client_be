const emailRegExp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
const numberRegExp = /^\d{9}/;
const numberContactsRegExp = /^(\+380|0)\d{9}$/;
const uaLanguageRegExp = /^[а-яїієґ0-9\s]+$/i;
const enLanguageRegExp = /^[a-z0-9\s]+$/i;
const userNameRegExp =
  /^(?=.{2,30}$)[a-zA-Zа-яА-ЯІЄЇіїє]+(([',. -][a-zA-Zа-яА-ЯІЄЇіїє])?[a-zA-Zа-яА-ЯІЄЇіїє])$/u;
const passwordRegExp =
  /^(?=.*[A-ZА-ЯІЇЄ])(?=.*\d)[a-zA-Zа-яА-ЯіїєІЇЄ\d!@#$%^&*()~¥=_+}{":;'?/>.<,\\`|[\]-]{6,30}$/;
const zipcodeRegExp = /^\d{5}(?:[-\s]\d{4})?$/;
const certificateRegExp = /^HOR\d{8}$/i;
const onlyNumbersRegExp = /^\d*$/;

module.exports = {
  emailRegExp,
  numberRegExp,
  numberContactsRegExp,
  uaLanguageRegExp,
  enLanguageRegExp,
  userNameRegExp,
  passwordRegExp,
  zipcodeRegExp,
  certificateRegExp,
  onlyNumbersRegExp,
};
