const bcrypt = require('bcrypt');

const CustomError = require('../../util/customError');
const fieldValidator = require('../../util/fieldValidator');
const userRepo = require('../../repos/v1/user.repo');
const jwtService = require('../jwt.service');

const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const userService = {
  userRegister: async (data) => {
    const { name, email, password } = data;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_string(name, 'name'));
    errorArray.push(await fieldValidator.validate_email(email, 'email'));
    errorArray.push(await fieldValidator.validate_string(password, 'password'));

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

    // check is user is already registered
    const user = await userRepo.getByEmail(email);
    if (user) {
      throw new CustomError(RESPONSE.USER.EXISTS);
    }

    // hash password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create new user
    const userData = {
      name: name,
      email: email,
      password: encryptedPassword,
      isActive: true,
    };
    const newUser = await userRepo.insert(userData);

    // remove password
    const userObj = newUser.toObject();
    delete userObj.password;

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        user: userObj,
      },
    };
  },

  userLogin: async (data) => {
    const { email, password } = data;
    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_email(email, 'email'));
    errorArray.push(await fieldValidator.validate_string(password, 'password'));

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

    // get user details
    const user = await userRepo.getByEmail(email);
    if (!user) {
      throw new CustomError(RESPONSE.USER.INVALID_CRED, STATUS_CODE.UNAUTHORIZED);
    }

    // validate password and remove it
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new CustomError(RESPONSE.USER.INVALID_CRED, STATUS_CODE.UNAUTHORIZED);
    }
    const userObj = user.toObject();
    delete userObj.password;

    // check if user is active
    if (!userObj.isActive) {
      throw new CustomError(RESPONSE.USER.INACTIVE, STATUS_CODE.FORBIDDON);
    }

    // generate access token and refresh token
    const tokenUser = {
      userId: userObj._id,
      name: userObj.name,
      email: userObj.email,
      isActive: userObj.isActive,
    };
    const accessToken = await jwtService.generateAccessToken(tokenUser);
    const refreshToken = await jwtService.generateRefreshToken(tokenUser);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        user: userObj,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
};

module.exports = userService;
