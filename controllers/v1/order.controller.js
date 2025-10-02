const orderService = require('../../services/v1/order.service');

const orderController = {
  checkout: async (req, res, next) => {
    try {
      const { items } = req.body;
      const { userId, email } = req.user;
      const orderData = { items, userId, email };

      const response = await orderService.createNewOrder(orderData);
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

  getAll: async (req, res, next) => {
    try {
      const { userId } = req.user;

      const response = await orderService.getAllOrdersForUser(userId);
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

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const getData = { id, userId };

      const response = await orderService.getOrderById(getData);
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

module.exports = orderController;
