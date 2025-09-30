const itemRepo = require('../../repos/v1/item.repo');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const itemService = {
  getAllClothingItems: async (page = 1, limit = 6, filters) => {
    const query = {};

    // Search by name or description
    if (filters.search) {
      query.$or = [{ name: { $regex: filters.search, $options: 'i' } }, { description: { $regex: filters.search, $options: 'i' } }];
    }

    // Filter by category
    if (filters.category) query.category = filters.category;

    // Filter by size
    if (filters.size) query.sizes = filters.size;

    // Filter by price
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      query.price = {};
      if (filters.minPrice !== null) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== null) query.price.$lte = filters.maxPrice;
    }

    const skip = (page - 1) * limit;

    // Fetch items using query + pagination
    const items = await itemRepo.findWithPagination(query, skip, limit);

    // Count total items matching query
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
};

module.exports = itemService;
