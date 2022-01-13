const wrongId = '60102a6d0ed5be43dc9f7f1d';
const notValidId = '60102a6d0ed5b3dc9f7f1d';
const filter = {
  search: '',
  category: [],
  available: [],
  availableForConstructor: [],
};

const sort = {
  name: 1,
};

const pagination = {
  skip: 0,
  limit: 5,
};

const newModel = categoryId => ({
  category: categoryId,
  priority: 2,
  show: true,
  name: [
    { value: 'Тест', lang: 'uk' },
    { value: 'Test', lang: 'en' },
  ],
  description: [
    { value: 'Тест', lang: 'uk' },
    { value: 'Test', lang: 'en' },
  ],
  images: {
    small: 'small_new',
    thumbnail: 'thumbnail_new',
    large: 'large_new',
    medium: 'medium_new',
  },
});
const newModelUpdated = categoryId => ({
  category: categoryId,
  priority: 3,
  show: true,
  name: [
    { value: 'Обновлено', lang: 'uk' },
    { value: 'Updated', lang: 'en' },
  ],
  description: [
    { value: 'Обновлено', lang: 'uk' },
    { value: 'Updated', lang: 'en' },
  ],
  images: {
    large: 'large_new',
    medium: 'medium_new',
    small: 'small_new',
    thumbnail: 'thumbnail_new',
  },
});

module.exports = {
  newModel,
  newModelUpdated,
  wrongId,
  notValidId,
  filter,
  sort,
  pagination,
};
