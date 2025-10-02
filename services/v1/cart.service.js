const CustomError = require('../../util/customError');
const logger = require('../../middleware/log/logger');
const itemRepo = require('../../repos/v1/item.repo');
const cartRepo = require('../../repos/v1/cart.repo');
const fieldValidator = require('../../util/fieldValidator');
const displayIdGenerator = require('../../common/displayIdGenerator');
const STATUS = require('../../enum/cartStatus');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const cartService = {
  addToCart: async (data) => {
    const { items, userId } = data;

    // validate cart items
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
    const displayId = await displayIdGenerator.CART_ID();

    // create new cart
    const cartData = {
      displayId: displayId,
      userId: userId,
      items: items,
      status: STATUS.ACTIVE,
      totalPrice: total,
    };
    const newCart = await cartRepo.insert(cartData);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        cart: newCart,
      },
    };
  },

  getUserCart: async (userId) => {
    const cart = await cartRepo.getActiveByUserId(userId);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        cart: cart,
      },
    };
  },
};

module.exports = cartService;
