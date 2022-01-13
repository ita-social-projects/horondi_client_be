const {
  roles: { SUPERADMIN },
} = require('../../consts');
const {
  HISTORY_ACTIONS: { ADD_SIZE },
} = require('../../consts/history-actions');
const { FIRST_NAME } = require('../../consts/test-admin');

const GET_ALL_RECORDS_PARAMS = {
  limit: 10,
  skip: 0,
  filter: {
    date: {
      dateFrom: new Date(2021, 4, 1).getTime(),
      dateTo: Date.now(),
    },
    action: [ADD_SIZE],
    fullName: FIRST_NAME,
    role: [SUPERADMIN],
  },
};

const ACTION = 'action';
const VALUE_BEFORE_CHANGE = 'valueBeforeChange';
const WRONG_ID = '6070d0c7cb643400241bf512';

module.exports = {
  GET_ALL_RECORDS_PARAMS,
  ACTION,
  VALUE_BEFORE_CHANGE,
  WRONG_ID,
};
