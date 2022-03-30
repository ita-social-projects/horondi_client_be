const { setupApp } = require('../helper-functions');

const {
  addRestriction,
  deleteRestriction,
  getAllRestrictions,
  getRestrictionById,
} = require('./restriction.helper');

const {
  restrictionParameters,
  restrictionFilter,
  wrongRestrictionId,
} = require('./restriction.variables');

const {
  restrictionMessages: { RESTRICTION_NOT_FOUND },
} = require('../../consts/restriction.messages');

let operations = null;
const restrictionIds = [];

describe('Restriction queries', () => {
  beforeAll(async () => {
    operations = await setupApp();

    for (let i = 0; i < 2; i++) {
      restrictionIds.push(
        (await addRestriction(restrictionParameters, operations))._id
      );
    }
  });

  test('Should find all restrictions', async () => {
    const restrictions = await getAllRestrictions(
      10,
      0,
      restrictionFilter,
      operations
    );
    const res = restrictions.items.map(el => el._id);
    expect(res).toEqual(restrictionIds);
  });

  test('Should find restriction by id', async () => {
    const restriction = await getRestrictionById(restrictionIds[0], operations);
    expect(restriction._id).toBe(restrictionIds[0]);
  });

  test('Should return error if restriction id incorrect', async () => {
    const res = await getRestrictionById(wrongRestrictionId, operations);
    expect(res.message).toBe(RESTRICTION_NOT_FOUND);
  });

  afterAll(async () => {
    while (restrictionIds.length > 0) {
      const restrictionId = restrictionIds.pop();
      await deleteRestriction(restrictionId, operations);
    }
  });
});
