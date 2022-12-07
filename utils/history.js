const _ = require('lodash');

const generateHistoryObject = (
  historyEvent,
  subjectModel,
  subjectName,
  subjectId,
  valueBeforeChange,
  valueAfterChange,
  userId = ''
) => ({
  action: historyEvent.action,
  historyName: historyEvent.historyName,
  subject: {
    model: subjectModel,
    name: subjectName,
    subjectId,
  },
  valueBeforeChange,
  valueAfterChange,
  userId,
});

const getChanges = (objBefore, objWithChanges) => {
  const beforeChanges = [];
  const afterChanges = [];

  _.mergeWith(objBefore, objWithChanges, (oldValue, newValue, key) => {
    if (
      (!_.isEqual(oldValue, newValue) && Object(oldValue) !== oldValue) ||
      (_.isObject(oldValue) &&
        _.isString(newValue) &&
        oldValue.toString() !== newValue)
    ) {
      beforeChanges.push({ [key]: oldValue });
      afterChanges.push({ [key]: newValue });
    }
  });

  return {
    beforeChanges,
    afterChanges,
  };
};

const generateHistoryChangesData = (obj, keys = []) => {
  const changes = [];

  keys.forEach(key => {
    changes.push({ [key]: obj[key] });
  });

  return changes;
};

module.exports = {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
};
