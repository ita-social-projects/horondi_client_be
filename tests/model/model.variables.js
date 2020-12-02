const wrongId = '56ade69dd46eafc5968e5390';
const newCategory = {
  available: true,
  name: [
    {
      value: 'Нова',
      lang: 'uk',
    },
    {
      value: 'New',
      lang: 'en',
    },
  ],
  images: {
    large: 'large_none',
    medium: 'medium_none',
    small: 'small_none',
    thumbnail: 'thumbnail_none',
  },
};

const newModel = {
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
};

const newModelMutation = {
  name: [
    { value: 'Мутація', lang: 'uk' },
    { value: 'Mutation', lang: 'en' },
  ],
  description: [
    { value: 'Мутація', lang: 'uk' },
    { value: 'Mutation', lang: 'en' },
  ],
  images: {
    large: 'large_new',
    medium: 'medium_new',
    small: 'small_new',
    thumbnail: 'thumbnail_new',
  },
};

const newModelUpdated = {
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
};

module.exports = {
  newCategory,
  newModel,
  newModelMutation,
  newModelUpdated,
  wrongId,
};
