const purchaseService = require('../../services/v1/purchase.service');

const purchaseController = {
  checkout: async (req, res, next) => {
    try {
      const { items } = req.body;
      const userId = req.user.userId;
      const purchaseData = { items, userId };

      const response = await purchaseService.createNewPurchase(purchaseData);
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
      const userId = req.user.userId;

      const response = await purchaseService.getAllPurchaseForUser(userId);
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
      const purchaseId = req.params.id;
      const userId = req.user.userId;
      const getData = { purchaseId, userId };

      const response = await purchaseService.getPurchaseById(getData);
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

module.exports = purchaseController;
