const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const itemRouter = require('./item.routes');
const purchaseRouter = require('./purchase.routes');

routesV1.use('/user', userRouter);
routesV1.use('/item', itemRouter);
routesV1.use('/purchase', purchaseRouter);

module.exports = routesV1;
