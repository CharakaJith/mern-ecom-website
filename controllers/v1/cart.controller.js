const cartService = require('../../services/v1/cart.service');

const cartController = {
  add: async (req, res, next) => {
    try {
      const cartData = ({ itemId, name, quantity, size, price } = req.body);
      cartData.userId = req.user.userId;

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

  update: async (req, res, next) => {
    try {
      const cartData = ({ itemId, name, quantity, size, price } = req.body);
      cartData.userId = req.user.userId;
      cartData.id = req.params.id;

      const response = await cartService.updateCartItems(cartData);
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

  delete: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const deleteData = { userId, id };

      const response = await cartService.removeUserCart(deleteData);
      const { success, status } = response;

      res.status(status).json({
        success: success,
        response: {
          status: status,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
