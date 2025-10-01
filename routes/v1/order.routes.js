const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const orderController = require('../../controllers/v1/order.controller');

const orderRouter = express.Router();

orderRouter.use(authenticate);

orderRouter.post('/', orderController.checkout);
orderRouter.get('/', orderController.getAll);
orderRouter.get('/:id', orderController.getById);

module.exports = orderRouter;
