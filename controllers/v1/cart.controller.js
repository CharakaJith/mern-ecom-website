const cartService = require('../../services/v1/cart.service');

const cartController = {
  add: async (req, res, next) => {
    try {
      const { items } = req.body;
      const userId = req.user.userId;
      const cartData = { items, userId };

      const response = await cartService.addToCart(cartData);
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

  get: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const response = await cartService.getUserCart(userId);
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

module.exports = cartController;
