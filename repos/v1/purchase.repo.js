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
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = purchaseRepo;
