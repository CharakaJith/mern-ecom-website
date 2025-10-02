const mongoose = require('mongoose');

const SIZE = require('../enum/clothingSizes');
const STATUS = require('../enum/cartStatus');

const cartSchema = new mongoose.Schema(
  {
    displayId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ClothingItem',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
          enum: SIZE.values,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: STATUS.values,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Cart', cartSchema);
