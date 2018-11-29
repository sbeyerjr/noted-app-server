"use strict";

const mongoose = require("mongoose");

const { TEST_DATABASE_URL } = require("../config");

console.log(`Connecting to mongodb at ${TEST_DATABASE_URL}`);
mongoose
  .connect(TEST_DATABASE_URL)
  .then(() => {
    console.log("Dropping database");
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });
