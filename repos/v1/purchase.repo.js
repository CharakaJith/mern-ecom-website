const Purchase = require('../../models/purchase');

const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { ENTITY } = require('../../constants/entity.constants');
const { STATUS_CODE } = require('../../constants/app.constants');

const purchaseRepo = {
  insert: async (purchaseData) => {
    try {
      const purchase = new Purchase(purchaseData);
      return await purchase.save();
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.PURCHASE, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (purchaseId) => {
    try {
      return await Purchase.findById(purchaseId).populate('userId', '_id name').populate('items.itemId', 'name');
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_Id(ENTITY.PURCHASE, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getAllByUserId: async (userId) => {
    try {
      const purchases = await Purchase.find({ userId }).sort({ createdAt: -1 });
      return purchases;
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_UserId(ENTITY.PURCHASE, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = purchaseRepo;
