const itemRepo = require('../../repos/v1/item.repo');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const itemService = {
  getAllClothingItems: async () => {
    const clothingItems = await itemRepo.getAll();

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        items: clothingItems,
      },
    };
  },
};

module.exports = itemService;
