const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const itemRouter = require('./item.routes');
const orderRouter = require('./order.routes');
const cartRouter = require('./cart.routes');

routesV1.use('/user', userRouter);
routesV1.use('/item', itemRouter);
routesV1.use('/order', orderRouter);
routesV1.use('/cart', cartRouter);

module.exports = routesV1;
