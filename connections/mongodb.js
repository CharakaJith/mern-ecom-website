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
    } catch (err) {
      console.error(DATABASE.CONN.FAILED(err));
      process.exit(1);
    }
  }
}

module.exports = MongoDB;
