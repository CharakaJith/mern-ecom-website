const Cart = require('../../models/cart');

const CustomError = require('../../util/customError');
const STATUS = require('../../enum/cartStatus');
const { DAO } = require('../../common/messages');
const { ENTITY } = require('../../constants/entity.constants');
const { STATUS_CODE } = require('../../constants/app.constants');

const cartRepo = {
  insert: async (cartData) => {
    try {
      const cart = new Cart(cartData);
      return await cart.save();
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.CART, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getActiveByUserId: async (userId) => {
    try {
      return await Cart.find({
        userId,
        status: STATUS.ACTIVE,
      }).sort({ createdAt: -1 });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_UserId(ENTITY.CART, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = cartRepo;
