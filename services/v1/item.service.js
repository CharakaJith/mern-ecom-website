const CustomError = require('../../util/customError');
const itemRepo = require('../../repos/v1/item.repo');
const fieldValidator = require('../../util/fieldValidator');
const logger = require('../../middleware/log/logger');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const itemService = {
  getAllClothingItems: async (page = 1, limit = 6, filters) => {
    const query = {};

    // search by name or description
    if (filters.search) {
      query.$or = [{ name: { $regex: filters.search, $options: 'i' } }, { description: { $regex: filters.search, $options: 'i' } }];
    }

    // filter by category
    if (filters.category) query.category = filters.category;

    // filter by size
    if (filters.size) query.sizes = filters.size;

    // filter by price
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      query.price = {};
      if (filters.minPrice !== null) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== null) query.price.$lte = filters.maxPrice;
    }

    const skip = (page - 1) * limit;

    // fetch items
    const items = await itemRepo.findWithPagination(query, skip, limit);

    // count total items
    const totalItems = await itemRepo.count(query);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        items,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  },

  getClothingItemById: async (itemId) => {
    // sanitize item id
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_objectId(itemId, 'item id'));

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

    const item = await itemRepo.getById(itemId);
    if (!item) {
      throw new CustomError(RESPONSE.ITEM.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        item,
      },
    };
  },
};

module.exports = itemService;
