const { customAlphabet } = require('nanoid');

// alphabet for 7 digit numbers
const nano7 = customAlphabet('0123456789', 7);

const displayIdGenerator = {
  USER_ID: async () => {
    return `USR-${nano7()}`;
  },

  CART_ID: async () => {
    return `CRT-${nano7()}`;
  },

  ORDER_ID: async () => {
    return `ORDR-${nano7()}`;
  },
};

module.exports = displayIdGenerator;
