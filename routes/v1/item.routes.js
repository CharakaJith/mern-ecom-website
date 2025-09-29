const express = require('express');
const itemController = require('../../controllers/v1/item.controller');

const itemRouter = express.Router();

itemRouter.get('/', itemController.getAll);

module.exports = itemRouter;
