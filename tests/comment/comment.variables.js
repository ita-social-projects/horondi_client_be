const userWrongId = '5fae5ab81069f737a6d4c00d';
const productWrongId = '5faa3d306071ad276cc3d63f';
const commentWrongId = '5faa3d306071ad276cc3d63c';
const wrongData = '123siSTm#';
const rate = 4;
const updatedRate = 1;
const updatedRateResult = 2.5;
const newComment = userId => ({
  text: 'Test text',
  user: userId,
  show: false,
});
const updatedComment = {
  text: 'updated text',
  show: true,
};

module.exports = {
  userWrongId,
  newComment,
  wrongData,
  updatedComment,
  commentWrongId,
  productWrongId,
  rate,
  updatedRate,
  updatedRateResult,
};
