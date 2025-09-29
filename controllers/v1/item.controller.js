const itemService = require('../../services/v1/item.service');

const itemController = {
  getAll: async (req, res, next) => {
    try {
      const response = await itemService.getAllClothingItems();
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

module.exports = itemController;
