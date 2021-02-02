const newCategoryInputData = {
  code: 'Code for test',
  name: [
    { lang: 'uk', value: 'Категорія тест' },
    { lang: 'en', value: 'Category test' },
  ],
  images: {
    large: 'large_10b1e9gkhm7xa9m_backpacks.jpg',
    medium: 'medium_10b1e9gkhm7xa9m_backpacks.jpg',
    small: 'small_10b1e9gkhm7xa9m_backpacks.jpg',
    thumbnail: 'thumbnail_10b1e9gkhm7xa9m_backpacks.jpg',
  },
  available: true,
};
const newCategoryInputDataUpdate = {
  code: 'Code for test',
  name: [
    { lang: 'uk', value: 'Категорія змінено' },
    { lang: 'en', value: 'Category update' },
  ],
  images: {
    large: 'large_10b1e9gkhm7ssxa9m_backpacks.jpg',
    medium: 'medium_10b1e9gksshm7xa9m_backpacks.jpg',
    small: 'small_10b1e9gkhm7ssxa9m_backpacks.jpg',
    thumbnail: 'thumbnail_10b1sse9gkhm7xa9m_backpacks.jpg',
  },
  available: true,
};
const wrongId = '5fb412d8663cf10bec9faa1a';

module.exports = {
  newCategoryInputData,
  newCategoryInputDataUpdate,
  wrongId,
};
