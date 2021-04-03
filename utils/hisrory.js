const _ = require('lodash');

const generateHistoryObject = (
  action,
  subjectName,
  subjectId,
  valueBeforeChange,
  valueAfterChange,
  userId
) => ({
  action,
  subject: {
    name: subjectName,
    subjectId,
  },
  valueBeforeChange,
  valueAfterChange,
  userId,
});

const getChanges = (objBefore, objAfter) => {
  const beforeChanges = [];
  const afterChanges = [];

  _.mergeWith(objBefore, objAfter, (oldValue, newValue) => {
    if (!_.isEqual(oldValue, newValue) && Object(oldValue) !== oldValue) {
      beforeChanges.push(oldValue);
      afterChanges.push(newValue);
    }
  });
  return {
    beforeChanges,
    afterChanges,
  };
};

module.exports = {
  generateHistoryObject,
  getChanges,
};
