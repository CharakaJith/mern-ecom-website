const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const purchaseController = require('../../controllers/v1/purchase.controller');

const purchaseRouter = express.Router();

purchaseRouter.use(authenticate);

purchaseRouter.post('/', purchaseController.checkout);

module.exports = purchaseRouter;
