const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to db!");
    })
    .catch((e) => {
      console.error("cannot connect to db!");
      process.exit(1);
    });
}

module.exports = connectToDb;