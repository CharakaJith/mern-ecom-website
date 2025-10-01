const Order = require('../../models/order');

const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { ENTITY } = require('../../constants/entity.constants');
const { STATUS_CODE } = require('../../constants/app.constants');

const orderRepo = {
  insert: async (orderData) => {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.ORDER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (orderId) => {
    try {
      return await Order.findById(orderId).populate('userId', '_id name').populate('items.itemId', 'name');
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_Id(ENTITY.ORDER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getAllByUserId: async (userId) => {
    try {
      const order = await Order.find({ userId }).sort({ createdAt: -1 });
      return order;
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_UserId(ENTITY.ORDER, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = orderRepo;
