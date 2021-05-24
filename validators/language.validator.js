const languageValidator = function(langMin, langMax, valueMin, valueMax) {
  return {
    lang: Joi.string()
      .min(langMin)
      .max(langMax)
      .required(),
    value: Joi.string()
      .min(valueMin)
      .max(valueMax)
      .required(),
  };
};

module.exports = { languageValidator };
