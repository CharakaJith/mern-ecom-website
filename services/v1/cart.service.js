const CustomError = require('../../util/customError');
const logger = require('../../middleware/log/logger');
const itemRepo = require('../../repos/v1/item.repo');
const cartRepo = require('../../repos/v1/cart.repo');
const fieldValidator = require('../../util/fieldValidator');
const displayIdGenerator = require('../../common/displayIdGenerator');
const STATUS = require('../../enum/cartStatus');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE, JWT } = require('../../common/messages');

const cartService = {
  addToCart: async (data) => {
    const { itemId, name, quantity, size, price, userId } = data;

    // validate cart items
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(itemId, 'item id'));
    errorArray.push(await fieldValidator.validate_string(name, 'item name'));
    errorArray.push(await fieldValidator.validate_number(price, 'item price'));
    errorArray.push(await fieldValidator.validate_number(quantity, 'item quantity'));
    errorArray.push(await fieldValidator.validate_string(size, 'item size'));

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

    // check availablity
    const availableItem = await itemRepo.getById(itemId);
    if (!availableItem) {
      throw new CustomError(RESPONSE.ITEM.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check size
    if (!availableItem.sizes.includes(size)) {
      throw new CustomError(RESPONSE.ITEM.INVALID_SIZE(size, availableItem.sizes), STATUS_CODE.BAD_REQUEST);
    }

    // calculate total
    const total = price * quantity;

    // generate display id
    const displayId = await displayIdGenerator.CART_ID();

    // create new cart
    const cartData = {
      displayId: displayId,
      userId: userId,
      items: [
        {
          itemId,
          name,
          quantity,
          price,
          size,
        },
      ],
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

  removeUserCart: async (deleteData) => {
    const { userId, id } = deleteData;

    // sanitize cart id
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(id, 'cart id'));

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

    // get cart
    const cart = await cartRepo.getById(id);
    if (!cart || cart.status !== STATUS.ACTIVE) {
      throw new CustomError(RESPONSE.CART.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check cart belongs to user
    if (cart.userId._id.toString() !== userId) {
      throw new CustomError(JWT.AUTH.FORBIDDEN, STATUS_CODE.FORBIDDON);
    }

    // update cart status
    cart.status = STATUS.INACTIVE;
    await cartRepo.update(cart);

    return {
      success: true,
      status: STATUS_CODE.NO_CONTENT,
    };
  },
};

module.exports = cartService;
