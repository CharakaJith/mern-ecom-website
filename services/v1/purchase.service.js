const CustomError = require('../../util/customError');
const purchaseRepo = require('../../repos/v1/purchase.repo');
const fieldValidator = require('../../util/fieldValidator');
const logger = require('../../middleware/log/logger');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE, JWT } = require('../../common/messages');
const itemRepo = require('../../repos/v1/item.repo');

const purchaseService = {
  createNewPurchase: async (data) => {
    const { items, userId } = data;

    // validate purchase details
    const errorArray = [];
    for (const item of items) {
      const { itemId, price, quantity, size } = item;

      const validations = [
        { field: 'itemId', result: await fieldValidator.validate_objectId(itemId, 'item id') },
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

    // create new purchase
    const purchaseData = {
      userId: userId,
      items: items,
      totalPrice: total,
    };
    const newPurchase = await purchaseRepo.insert(purchaseData);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        purchase: newPurchase,
      },
    };
  },

  getAllPurchaseForUser: async (userId) => {
    const purchases = await purchaseRepo.getAllByUserId(userId);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        purchases: purchases,
      },
    };
  },

  getPurchaseById: async (data) => {
    const { purchaseId, userId } = data;

    // sanitize purchase id
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(purchaseId, 'purchase id'));

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

    // get purchase
    const purchase = await purchaseRepo.getById(purchaseId);
    if (!purchase) {
      throw new CustomError(RESPONSE.PURCHASE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check purchase belong to user
    if (purchase.userId._id.toString() !== userId) {
      throw new CustomError(JWT.AUTH.FORBIDDEN, STATUS_CODE.FORBIDDON);
    }

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        purchase,
      },
    };
  },
};

module.exports = purchaseService;
