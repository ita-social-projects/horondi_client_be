const { setupApp } = require('../helper-functions');
const { createSize, updateSize, deleteSize } = require('../size/size.helper');
const { SIZES_TO_CREATE } = require('../size/size.variables');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  getAllHistoryRecords,
  getHistoryRecordById,
} = require('./history.helper');
const {
  ACTION,
  VALUE_BEFORE_CHANGE,
  GET_ALL_RECORDS_PARAMS,
  WRONG_ID,
} = require('./history.variables');
const {
  HISTORY_ACTIONS: { ADD_SIZE },
} = require('../../consts/history-actions');
const {
  HISTORY_RECORD_IS_NOT_PRESENT,
} = require('../../error-messages/history');

jest.mock('../../modules/currency/currency.utils.js');

describe('history query tests', () => {
  let operations;
  let sizeId;
  let recordId;

  beforeAll(async () => {
    operations = await setupApp();
    const size = await createSize(SIZES_TO_CREATE.size1, operations);
    sizeId = size._id;
    await updateSize(sizeId, SIZES_TO_CREATE.size2, operations);
  });

  afterAll(async () => {
    await deleteSize(sizeId, operations);
  });

  it('Should get all history records', async () => {
    const allRecords = await getAllHistoryRecords(
      GET_ALL_RECORDS_PARAMS,
      operations
    );
    recordId = allRecords.items[0]._id;
    const { items, count } = allRecords;
    const [item] = items;
    expect(allRecords).toBeDefined();
    expect(count).toBe(1);
    expect(items).toBeInstanceOf(Array);
    expect(item).toHaveProperty(ACTION, ADD_SIZE);
    expect(item).toHaveProperty(VALUE_BEFORE_CHANGE, []);
  });

  it('Should get history record by id', async () => {
    const record = await getHistoryRecordById(recordId, operations);
    expect(record).toBeDefined();
    expect(record).toHaveProperty(ACTION, ADD_SIZE);
    expect(record).toHaveProperty(VALUE_BEFORE_CHANGE, []);
  });

  it('Should throw an error when try to get not existing record', async () => {
    const error = await getHistoryRecordById(WRONG_ID, operations);
    expect(error).toEqual({
      message: HISTORY_RECORD_IS_NOT_PRESENT,
      statusCode: NOT_FOUND,
    });
  });
});