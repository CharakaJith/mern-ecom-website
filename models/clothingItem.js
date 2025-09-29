const mongoose = require('mongoose');

const CATEGORY = require('../enum/clothingCategory');
const SIZE = require('../enum/clothingSizes');

const clothingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: CATEGORY.values,
      required: true,
    },
    sizes: [
      {
        type: String,
        enum: SIZE.values,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
