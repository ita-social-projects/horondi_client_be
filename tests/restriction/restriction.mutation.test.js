const { setupApp } = require('../helper-functions');

const {
  addRestriction,
  deleteRestriction,
  updateRestriction,
} = require('./restriction.helper');

const {
  restrictionParameters,
  updateRestrictionParameters,
  wrongRestrictionId,
} = require('./restriction.variables');

const {
  restrictionMessages: { RESTRICTION_NOT_FOUND },
} = require('../../consts/restriction.messages');

let operations = null;
let restrictionId = null;

describe('Restriction queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('Should create restriction', async () => {
    restrictionId = (await addRestriction(restrictionParameters, operations))
      ._id;

    expect(typeof restrictionId).toBe('string');
    expect(restrictionId.length).toBeGreaterThan(10);
  });

  test('Should update restriction', async () => {
    const res = await updateRestriction(
      restrictionId,
      updateRestrictionParameters,
      operations
    );
    delete res._id;

    expect(res).toEqual(updateRestrictionParameters);
    expect(res).not.toEqual(restrictionParameters);
  });

  test('Should return error when create restriction without data', async () => {
    const res = await addRestriction({}, operations);
    expect('message' in res).toBeTruthy();
  });

  test('Should return error when update if restriction id incorrect', async () => {
    const res = await updateRestriction(
      wrongRestrictionId,
      updateRestrictionParameters,
      operations
    );
    expect(res.message).toBe(RESTRICTION_NOT_FOUND);
  });

  test('Should return error when delete if restriction id incorrect', async () => {
    const res = await deleteRestriction(wrongRestrictionId, operations);
    expect(res.message).toBe(RESTRICTION_NOT_FOUND);
  });

  test('Should delete restriction', async () => {
    const deletedRestrictionId = (
      await deleteRestriction(restrictionId, operations)
    )._id;
    expect(deletedRestrictionId).toBe(restrictionId);
  });
});
