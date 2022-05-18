const FilterHelper = require('../../helpers/filter-helper');
const { filtration } = require('./filter-helper.helper');

describe('test filtration', () => {
  let TestfilterHelper;

  beforeAll(async () => {
    TestfilterHelper = new FilterHelper();
  });
  it('should make the search filter for test', async () => {
    const filter = {};
    TestfilterHelper.filterByName(filter, 'test');
    expect(filter).toMatchObject(filtration);
  });
  it('should show search filter for empty row', async () => {
    const filter = {};
    TestfilterHelper.filterByName(filter, '');
    expect(filter).toMatchObject({});
  });
});

describe('test status filtration', () => {
  let TestfilterHelper;

  beforeAll(async () => {
    TestfilterHelper = new FilterHelper();
  });

  it('should search for status active', () => {
    const filter = {};
    TestfilterHelper.filterByStatus('active', new Date(2014, 1, 11), filter);
    expect(filter).toMatchObject({
      $and: [
        {
          $or: [
            {
              $and: [
                {
                  dateFrom: {
                    $lt: new Date(2014, 1, 11),
                  },
                },
                {
                  dateTo: {
                    $gt: new Date(2014, 1, 11),
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it('should search for status expired', () => {
    const filter = {};
    TestfilterHelper.filterByStatus('expired', new Date(2014, 1, 11), filter);
    expect(filter).toMatchObject({
      $and: [
        {
          $or: [
            {
              dateTo: {
                $lt: new Date(2014, 1, 11),
              },
            },
          ],
        },
      ],
    });
  });
  it('should search for status planned', () => {
    const filter = {};
    TestfilterHelper.filterByStatus('planned', new Date(2014, 1, 11), filter);
    expect(filter).toMatchObject({
      $and: [
        {
          $or: [
            {
              dateFrom: {
                $gt: new Date(2014, 1, 11),
              },
            },
          ],
        },
      ],
    });
  });
});
