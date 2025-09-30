const ClothingItem = require('../../models/clothingItem');

const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { ENTITY } = require('../../constants/entity.constants');
const { STATUS_CODE } = require('../../constants/app.constants');

const itemRepo = {
  getAll: async () => {
    try {
      return await ClothingItem.find({});
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.All(ENTITY.CLOTHINGITEM, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  count: async (query) => {
    try {
      return await ClothingItem.countDocuments(query);
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.Count(ENTITY.CLOTHINGITEM, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  findWithPagination: async (query, skip, limit) => {
    try {
      return await ClothingItem.find(query).skip(skip).limit(limit);
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.All(ENTITY.CLOTHINGITEM, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = itemRepo;
