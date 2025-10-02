const CustomError = require('../../util/customError');
const logger = require('../../middleware/log/logger');
const itemRepo = require('../../repos/v1/item.repo');
const cartRepo = require('../../repos/v1/cart.repo');
const fieldValidator = require('../../util/fieldValidator');
const displayIdGenerator = require('../../common/displayIdGenerator');
const STATUS = require('../../enum/cartStatus');
const ACTIONS = require('../../enum/cartActions');

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

    // check if user have active cart
    const cart = await cartRepo.getActiveByUserId(userId);
    if (cart) {
      throw new CustomError(RESPONSE.CART.EXISTS, STATUS_CODE.BAD_REQUEST);
    }

    // check item availablity
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
    if (!cart) {
      throw new CustomError(RESPONSE.CART.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        cart: cart,
      },
    };
  },

  cartActions: async (data) => {
    const { action, cartId, objectId, userId } = data;

    // validate request data
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(cartId, 'cart id'));
    errorArray.push(await fieldValidator.validate_objectId(objectId, 'object id'));

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

    // validate action
    if (!ACTIONS.values.includes(action)) {
      throw new CustomError(RESPONSE.CART.INVALID_ACTION, STATUS_CODE.BAD_REQUEST);
    }

    // check if cart is available
    const cart = await cartRepo.getById(cartId);
    if (!cart || cart.status !== STATUS.ACTIVE) {
      throw new CustomError(RESPONSE.CART.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check if cart belongs to user
    if (cart.userId._id.toString() !== userId) {
      throw new CustomError(JWT.AUTH.FORBIDDEN, STATUS_CODE.FORBIDDON);
    }

    // check if item is not in the cart
    const cartItem = cart.items.find((item) => item._id.toString() === objectId);
    if (!cartItem) {
      throw new CustomError(RESPONSE.CART.INVALID_ITEM, STATUS_CODE.BAD_REQUEST);
    }

    // perform actions
    switch (action) {
      case ACTIONS.ADD:
        cartItem.quantity++;
        break;
      case ACTIONS.REMOVE:
        cartItem.quantity--;

        if (cartItem.quantity === 0) {
          cart.items = cart.items.filter((item) => !(item._id.toString() === objectId));
        }

        break;
      case ACTIONS.DELETE:
        cart.items = cart.items.filter((item) => !(item._id.toString() === objectId));
        break;
    }

    // save changes
    const updatedCart = await cartRepo.update(cart);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        cart: updatedCart,
      },
    };
  },

  updateCartItems: async (data) => {
    const { itemId, name, quantity, size, price, userId, id } = data;

    // validate cart items
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(id, 'cart id'));
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

    // check if cart is available
    const cart = await cartRepo.getById(id);
    if (!cart || cart.status !== STATUS.ACTIVE) {
      throw new CustomError(RESPONSE.CART.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check if cart belongs to user
    if (cart.userId._id.toString() !== userId) {
      throw new CustomError(JWT.AUTH.FORBIDDEN, STATUS_CODE.FORBIDDON);
    }

    // check item availablity
    const availableItem = await itemRepo.getById(itemId);
    if (!availableItem) {
      throw new CustomError(RESPONSE.ITEM.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check size
    if (!availableItem.sizes.includes(size)) {
      throw new CustomError(RESPONSE.ITEM.INVALID_SIZE(size, availableItem.sizes), STATUS_CODE.BAD_REQUEST);
    }

    // check if item is already in the cart
    const existingItem = cart.items.find((item) => item.itemId._id.toString() === itemId.toString() && item.size === size);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        itemId,
        name,
        quantity,
        size,
        price,
      });
    }

    // ppdate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // update cart
    const updatedCart = await cartRepo.update(cart);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        cart: updatedCart,
      },
    };
  },

  removeUserCart: async (data) => {
    const { userId, id } = data;

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
