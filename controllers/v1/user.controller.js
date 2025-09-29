const userService = require('../../services/v1/user.service');

const userController = {
  register: async (req, res, next) => {
    try {
      const userData = ({ name, email, password } = req.body);

      const response = await userService.userRegister(userData);
      const { success, status, data } = response;

      res.status(status).json({
        success: success,
        response: {
          status: status,
          data: data,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const loginData = ({ email, password } = req.body);

      const response = await userService.userLogin(loginData);
      const { success, status, data } = response;

      res.status(status).json({
        success: success,
        response: {
          status: status,
          data: data,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
