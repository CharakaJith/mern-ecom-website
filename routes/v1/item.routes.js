const express = require('express');
const itemController = require('../../controllers/v1/item.controller');

const itemRouter = express.Router();

itemRouter.get('/', itemController.getAll);
itemRouter.get('/details/:id', itemController.getById);

module.exports = itemRouter;
