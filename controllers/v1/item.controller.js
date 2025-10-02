const itemService = require('../../services/v1/item.service');

const itemController = {
  getAll: async (req, res, next) => {
    try {
      // read pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;

      // read filters
      const search = req.query.search || '';
      const category = req.query.category || '';
      const size = req.query.size || '';
      const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : null;
      const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;

      const filters = { search, category, size, minPrice, maxPrice };

      const response = await itemService.getAllClothingItems(page, limit, filters);
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

      const response = await itemService.getClothingItemById(id);
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
