const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const itemRouter = require('./item.routes');

routesV1.use('/user', userRouter);
routesV1.use('/item', itemRouter);

module.exports = routesV1;
