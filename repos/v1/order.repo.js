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
      return await Order.findById(orderId)
        .populate({
          path: 'cartId',
          model: 'Cart',
          populate: {
            path: 'items.itemId',
            model: 'ClothingItem',
          },
        })
        .populate({
          path: 'userId',
          model: 'User',
          select: '_id name',
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_Id(ENTITY.ORDER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getAllByUserId: async (userId) => {
    try {
      return await Order.find({ userId })
        .populate({
          path: 'cartId',
          model: 'Cart',
          populate: {
            path: 'items.itemId',
            model: 'ClothingItem',
          },
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_UserId(ENTITY.ORDER, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = orderRepo;
