const restrictionParameters = {
  compareByExpression: 'IS_NOT_EQUAL',
  options: [
    {
      option: '60c270c83db8c8002420685a',
      feature: 'LEFT',
    },
    {
      option: '60c270c83db8c8002420685a',
      feature: 'RIGHT',
    },
  ],
};

const updateRestrictionParameters = {
  compareByExpression: 'IS_EQUAL',
  options: [
    {
      option: '60c270c83db8c8002420685b',
      feature: 'LEFT',
    },
    {
      option: '60c270c83db8c8002420685c',
      feature: 'RIGHT',
    },
    {
      option: '60c270c83db8c8002420685d',
      feature: 'TOP',
    },
  ],
};

const restrictionFilter = {
  compareByExpression: 'IS_NOT_EQUAL',
};

const wrongRestrictionId = '60c270c83db8c8002420685f';

module.exports = {
  restrictionParameters,
  restrictionFilter,
  updateRestrictionParameters,
  wrongRestrictionId,
};
