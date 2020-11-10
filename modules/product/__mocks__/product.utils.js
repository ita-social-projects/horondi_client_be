const uploadProductImages = () => {
  const createName = sizeName => `${sizeName}_${'1'}_test-file`;
  const primary = {
    large: createName('large'),
    medium: createName('medium'),
    small: createName('small'),
    thumbnail: createName('thumbnail'),
  };
  const additional = {
    large: createName('largeXL'),
    medium: createName('mediumXL'),
    small: createName('smallXL'),
    thumbnail: createName('thumbnailXL'),
  };
  return {
    primary,
    additional,
  };
};

module.exports = {
  uploadProductImages,
};
