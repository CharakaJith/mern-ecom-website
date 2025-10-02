const CustomError = require('../../util/customError');
const logger = require('../../middleware/log/logger');
const itemRepo = require('../../repos/v1/item.repo');
const orderRepo = require('../../repos/v1/order.repo');
const fieldValidator = require('../../util/fieldValidator');
const emailService = require('../email.service');
const displayIdGenerator = require('../../common/displayIdGenerator');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE, JWT } = require('../../common/messages');

const orderService = {
  createNewOrder: async (data) => {
    const { items, userId, email } = data;

    // validate order details
    const errorArray = [];
    for (const item of items) {
      const { itemId, name, price, quantity, size } = item;

      const validations = [
        { field: 'itemId', result: await fieldValidator.validate_objectId(itemId, 'item id') },
        { field: 'name', result: await fieldValidator.validate_string(name, 'item name') },
        { field: 'price', result: await fieldValidator.validate_number(price, 'item price') },
        { field: 'quantity', result: await fieldValidator.validate_number(quantity, 'item quantity') },
        { field: 'size', result: await fieldValidator.validate_string(size, 'item size') },
      ];

      validations.forEach((v) => {
        if (v.result !== 1) {
          errorArray.push({
            itemId,
            field: v.field,
            error: v.result,
          });
        }
      });
    }

    // validate availablity and sizes
    for (const item of items) {
      const availableItem = await itemRepo.getById(item.itemId);
      if (!availableItem) {
        errorArray.push({
          itemId: item.itemId,
          field: 'itemId',
          error: RESPONSE.ITEM.NOT_FOUND,
        });
        continue;
      }

      // check size
      if (!availableItem.sizes.includes(item.size)) {
        errorArray.push({
          itemId: item.itemId,
          field: 'size',
          error: RESPONSE.ITEM.INVALID_SIZE(item.size, availableItem.sizes),
        });
      }
    }

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

    // calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // generate display id
    const displayId = await displayIdGenerator.ORDER_ID();

    // create new order
    const orderData = {
      displayId: displayId,
      userId: userId,
      items: items,
      totalPrice: total,
    };
    const newOrder = await orderRepo.insert(orderData);

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
