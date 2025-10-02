const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const cartController = require('../../controllers/v1/cart.controller');

const cartRouter = express.Router();

cartRouter.use(authenticate);

cartRouter.post('/', cartController.add);
cartRouter.get('/', cartController.get);
cartRouter.delete('/:id', cartController.delete);

module.exports = cartRouter;
