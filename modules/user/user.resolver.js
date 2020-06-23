const userService = require('./user.service');

const userQuery = {
  getAllUsers: () => userService.getAllNews(),
  getUserById: (parent, args) => userService.getNewsById(args.id),
};
const userMutation = {
  addUser: (parent, args) => userService.addNews(args.user),
  deleteUser: (parent, args) => userService.deleteNews(args.id),
  updateUser: (parent, args) => userService.updateNews(args.id, args.user),
};

module.exports = { userQuery, userMutation };
