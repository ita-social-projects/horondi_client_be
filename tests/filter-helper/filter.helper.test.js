const FilterHelper = require('../../helpers/filter-helper');
const { filtration } = require('./filter-helper.helper');

describe('test filtration', () => {
  let TestfilterHelper;

  beforeAll(async () => {
    TestfilterHelper = new FilterHelper();
  });
  it('should make the search filter for test', async () => {
    const filter = {};
    TestfilterHelper.filterByDateOrName(filter, 'test');
    expect(filter).toMatchObject(filtration);
  });
  it('should show search filter for null', async () => {
    const filter = {};
    TestfilterHelper.filterByDateOrName(filter, null);
    expect(filter).toMatchObject({});
  });

  it('should show search filter for date', async () => {
    const filter = {};
    TestfilterHelper.filterByDateOrName(filter, '2022.03.31');
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
    TestfilterHelper.filterByStatus(
      'active',
      '2022-03-01T12:15:48.449+00:00',
      filter
    );
    expect(filter).toMatchObject({});
  });
  it('should search for status expired', () => {
    const filter = {};
    TestfilterHelper.filterByStatus(
      'expired',
      '2022-03-01T12:15:48.449+00:00',
      filter
    );
    expect(filter).toMatchObject({});
  });
  it('should search for status planned', () => {
    const filter = {};
    TestfilterHelper.filterByStatus(
      'planned',
      '2022-03-01T12:15:48.449+00:00',
      filter
    );
    expect(filter).toMatchObject({});
  });
});
