const CustomError = require('../../util/customError');
const logger = require('../../middleware/log/logger');
const cartRepo = require('../../repos/v1/cart.repo');
const orderRepo = require('../../repos/v1/order.repo');
const fieldValidator = require('../../util/fieldValidator');
const emailService = require('../email.service');
const displayIdGenerator = require('../../common/displayIdGenerator');
const STATUS = require('../../enum/cartStatus');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE, JWT } = require('../../common/messages');

const orderService = {
  createNewOrder: async (data) => {
    const { cartId, userId, email } = data;

    // validate order details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(cartId, 'cart id'));

    // check request data
    const filteredErrors = errorArray.filter((obj) => obj !== 1);
    if (filteredErrors.length !== 0) {
      logger(LOG_TYPE.ERROR, false, STATUS_CODE.BAD_REQUEST, filteredErrors);

      return {
        success: false,
        status: STATUS_CODE.BAD_REQUEST,
        data: filteredErrors,
      };
    }

    // get and validate cart
    const cart = await cartRepo.getById(cartId);
    if (!cart || cart.status !== STATUS.ACTIVE) {
      throw new CustomError(RESPONSE.CART.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // generate display id
    const displayId = await displayIdGenerator.ORDER_ID();

    // create new order
    const orderData = {
      displayId: displayId,
      userId: userId,
      cartId: cartId,
    };
    const newOrder = await orderRepo.insert(orderData);

    // update cart status
    cart.status = STATUS.PURCHASED;
    await cartRepo.update(cart);

    // send confrimation email
    await emailService.sendEmail(email, newOrder);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        order: newOrder,
      },
    };
  },

  getAllOrdersForUser: async (userId) => {
    const orders = await orderRepo.getAllByUserId(userId);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        orders: orders,
      },
    };
  },

  getOrderById: async (data) => {
    const { id, userId } = data;

    // sanitize order id
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(id, 'order id'));

    // check request data
    const filteredErrors = errorArray.filter((obj) => obj !== 1);
    if (filteredErrors.length !== 0) {
      logger(LOG_TYPE.ERROR, false, STATUS_CODE.BAD_REQUEST, filteredErrors);

      return {
        success: false,
        status: STATUS_CODE.BAD_REQUEST,
        data: filteredErrors,
      };
    }

    // get order
    const order = await orderRepo.getById(id);
    if (!order) {
      throw new CustomError(RESPONSE.ORDER.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check order belong to user
    if (order.userId._id.toString() !== userId) {
      throw new CustomError(JWT.AUTH.FORBIDDEN, STATUS_CODE.FORBIDDON);
    }

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        order,
      },
    };
  },
};

module.exports = orderService;
