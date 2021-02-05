const userWrongId = '5faced40a3e018192ca5cd8z';
const productWrongId = '5faa3d306071ad276cc3d63f';
const commentWrongId = '5faa3d306071ad276cc3d63c';
const wrongData = '123siSTm#';
const rate = 4;
const updatedRate = 1;
const newComment = userId => ({
  text: 'Test text',
  user: userId,
  show: false,
});
const updatedComment = userId => ({
  text: 'updated text',
  user: userId,
  show: true,
});

module.exports = {
  userWrongId,
  newComment,
  wrongData,
  updatedComment,
  commentWrongId,
  productWrongId,
  rate,
  updatedRate,
};
