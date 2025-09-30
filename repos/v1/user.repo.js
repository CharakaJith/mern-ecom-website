const User = require('../../models/user');

const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { ENTITY } = require('../../constants/entity.constants');
const { STATUS_CODE } = require('../../constants/app.constants');

const userRepo = {
  insert: async (userData) => {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getByEmail: async (email) => {
    try {
      return await User.findOne({ email: email });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_EMAIL(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (userId) => {
    try {
      return await User.findOne({ _id: userId });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.By_Id(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  update: async (user) => {
    try {
      return await user.save();
    } catch (error) {
      throw new CustomError(DAO.FAILED.UPDATE(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = userRepo;
