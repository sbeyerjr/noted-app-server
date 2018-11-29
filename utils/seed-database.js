"use strict";

const { TEST_DATABASE_URL } = require("../config");
const User = require("../models/user");

const db = require("../db/mongoose");
const seedUsers = require("../db/seed/users");

db.connect(TEST_DATABASE_URL)
  .then(() => {
    console.info("Dropping Database");
    return db.dropDatabase();
  })
  .then(() => {
    console.info("Seeding Database");
    return Promise.all([User.insertMany(seedUsers), User.createIndexes()]);
  })
  .then(() => {
    console.info("Disconnecting");
    return db.disconnect();
  })
  .catch(err => {
    db.disconnect();
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
