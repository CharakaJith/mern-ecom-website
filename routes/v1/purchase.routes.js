const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const purchaseController = require('../../controllers/v1/purchase.controller');

const purchaseRouter = express.Router();

purchaseRouter.use(authenticate);

purchaseRouter.post('/', purchaseController.checkout);
purchaseRouter.get('/', purchaseController.getAll);
purchaseRouter.get('/:id', purchaseController.getById);

module.exports = purchaseRouter;
