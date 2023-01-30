const {
  roles: { SUPERADMIN },
} = require('../../consts');
const {
  HISTORY_ACTIONS: { ADD_EVENT },
  HISTORY_NAMES: { MODEL_EVENT },
} = require('../../consts/history-events');
const { FIRST_NAME } = require('../../consts/test-admin');

const GET_ALL_RECORDS_PARAMS = {
  limit: 10,
  skip: 0,
  filter: {
    date: {
      dateFrom: new Date(2021, 4, 1).getTime(),
      dateTo: new Date(2023, 4, 1).getTime(),
    },
    action: [ADD_EVENT],
    historyName: [MODEL_EVENT],
    fullName: FIRST_NAME,
    role: [SUPERADMIN],
  },
};

const ACTION = 'action';
const HISTORY_NAME = 'historyName';
const VALUE_BEFORE_CHANGE = 'valueBeforeChange';
const WRONG_ID = '6070d0c7cb643400241bf512';

module.exports = {
  GET_ALL_RECORDS_PARAMS,
  ACTION,
  HISTORY_NAME,
  VALUE_BEFORE_CHANGE,
  WRONG_ID,
};
