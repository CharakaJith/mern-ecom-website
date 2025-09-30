const itemRepo = require('../../repos/v1/item.repo');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const itemService = {
  getAllClothingItems: async (page = 1, limit = 6) => {
    const skip = (page - 1) * limit;

    // get items for this page
    const items = await itemRepo.findWithPagination(skip, limit);

    // get total count for pagination
    const totalItems = await itemRepo.count();

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
};

module.exports = itemService;
