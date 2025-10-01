const mongoose = require('mongoose');
const { DATABASE } = require('../common/messages');

class MongoDB {
  static async connect() {
    const uri = process.env.MONGO_URI;

    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(DATABASE.CONN.SUCCESS);
    } catch (error) {
      console.error(DATABASE.CONN.FAILED(error));
      process.exit(1);
    }
  }
}

module.exports = MongoDB;
