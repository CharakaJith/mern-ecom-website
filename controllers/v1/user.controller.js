const userService = require('../../services/v1/user.service');

const userController = {
  register: async (req, res, next) => {
    console.log(await userService.userRegister());
  },
};

module.exports = userController;
