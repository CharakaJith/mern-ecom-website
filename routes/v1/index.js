const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const itemRouter = require('./item.routes');
const orderRouter = require('./order.routes');

routesV1.use('/user', userRouter);
routesV1.use('/item', itemRouter);
routesV1.use('/order', orderRouter);

module.exports = routesV1;
