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
};

module.exports = purchaseController;
