const uploadContactImages = () => {
  const createName = sizeName => `${sizeName}_${'1'}_test-file`;
  const images = {
    large: createName('large'),
    medium: createName('medium'),
  };
  return [
    { lang: 'en', value: images },
    { lang: 'ua', value: images },
  ];
};

module.exports = {
  uploadContactImages,
};
