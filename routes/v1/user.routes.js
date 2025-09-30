const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const userController = require('../../controllers/v1/user.controller');

const userRouter = express.Router();

userRouter.post('/', userController.register);
userRouter.post('/login', userController.login);

userRouter.use(authenticate);

userRouter.get('/', userController.get);

module.exports = userRouter;
