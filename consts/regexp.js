const emailRegExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const numberRegExp = new RegExp(/^\+?3?8?(0\d{9})$/);
const uaLanguageRegExp = new RegExp(/^[а-яїієґ0-9\s]+$/i);
const enLanguageRegExp = new RegExp(/^[a-z0-9\s]+$/i);

module.exports = {
  emailRegExp,
  numberRegExp,
  uaLanguageRegExp,
  enLanguageRegExp,
};
