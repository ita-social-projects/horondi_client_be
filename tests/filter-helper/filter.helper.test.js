const FilterHelper = require('../../helpers/filter-helper');
const {
  filtration,
  filterWithActive,
  filterWithExpired,
  filterWithPlanned,
} = require('./filter-helper.helper');

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
  it('should show search filter for empty data', async () => {
    expect(TestfilterHelper.filterByName()).toBe(undefined);
  });
});

describe('test status filtration', () => {
  let TestfilterHelper;

  beforeAll(async () => {
    TestfilterHelper = new FilterHelper();
  });
  it('should search for wrong status', () => {
    expect(TestfilterHelper.filterByStatus('blabla')).toBe(undefined);
  });

  it('should search for status active', () => {
    const filter = {};
    TestfilterHelper.filterByStatus('active', new Date(2014, 1, 11), filter);
    expect(filter).toMatchObject(filterWithActive);
  });
  it('should search for status expired', () => {
    const filter = {};
    TestfilterHelper.filterByStatus('expired', new Date(2014, 1, 11), filter);
    expect(filter).toMatchObject(filterWithExpired);
  });
  it('should search for status planned', () => {
    const filter = {};
    TestfilterHelper.filterByStatus('planned', new Date(2014, 1, 11), filter);
    expect(filter).toMatchObject(filterWithPlanned);
  });
});
