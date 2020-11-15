const validEmail = 'superadmin@gmail.com';
const invalidEmail = 'resttestqwerty123@gmail.com';
const productWrongId = '5faa3d306071ad276cc3d63f';
const commentWrongId = '5faa3d306071ad276cc3d63c';
const wrongData = '123siSTm#';
const rate = 4;
const updatedRate = 1;
const newComment = {
  text: 'Test text',
  user: { email: 'superadmin@gmail.com' },
  show: false,
};
const updatedComment = {
  text: 'updated text',
  user: { email: 'ermn7dyptp@yahoo.com' },
  show: true,
};

module.exports = {
  validEmail,
  invalidEmail,
  newComment,
  wrongData,
  updatedComment,
  commentWrongId,
  productWrongId,
  rate,
  updatedRate,
};
