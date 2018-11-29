"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const expect = chai.expect;
const { User } = require("../users");
const { Practice } = require("../models/practice");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL, JWT_SECRET } = require("../config");
const testUser = require("../db/seed/users")[0];
chai.use(chaiHttp);

function seedPracticeData() {
  console.info("seeding practice data");
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generatePracticeData());
  }
  // this will return a promise
  return Practice.insertMany(seedData);
}

function generatePracticeData() {
  return {
    date: faker.date.recent(),
    timePracticed: faker.random.number(),
    scales: faker.lorem.words(),
    otherMusic: faker.lorem.paragraph()
  };
}

function tearDownDb() {
  console.warn("Deleting database");
  return mongoose.connection.dropDatabase();
}

describe("Practices API resource", function() {
  let user;
  let token;
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return User.create(testUser).then(_user => {
      user = _user;
      token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });

      return Promise.all([seedPracticeData()]);
    });
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all existing practices", function() {
      let res;
      return chai
        .request(app)
        .get("/practice")
        .set("Authorization", `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          console.log(res.body);
          expect(res).to.have.status(200);
        });
    });

    it("should return practices with right fields", function() {
      // Strategy: Get back all practices, and ensure they have expected keys

      let resPractice;
      return chai
        .request(app)
        .get("/practice")
        .set("Authorization", `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          res.body.forEach(function(practice) {
            expect(practice).to.be.a("object");
            expect(practice).to.include.keys(
              "id",
              "date",
              "timePracticed",
              "scales",
              "otherMusic"
            );
          });
          resPractice = res.body[0];
        });
    });
  });
  describe("POST endpoint", function() {
    it("should add a new practice", function() {
      const newPractice = generatePracticeData();

      return chai
        .request(app)
        .post("/practice")
        .set("Authorization", `Bearer ${token}`)
        .send(newPractice);
    });
  });
  describe("PUT endpoint", function() {
    it("should update fields you send over", function() {
      const updateData = {
        date: "11/12/2018",
        timePracticed: "30 minutes",
        scales: "A, D, G",
        otherMusic: "I practiced Moonlight Sonata"
      };

      return Practice.findOne()
        .then(function(practice) {
          updateData.id = practice.id;
          return chai
            .request(app)
            .put(`/practice/${practice.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Practice.findById(updateData.id);
        })
        .then(function(practice) {
          expect(practice.date).to.equal(updateData.date);
          expect(practice.timePracticed).to.equal(updateData.timePracticed);
          expect(practice.scales).to.equal(updateData.scales);
          expect(practice.otherMusic).to.equal(updateData.otherMusic);
        });
    });
  });

  describe("DELETE endpoint", function() {
    it("delete a practice by id", function() {
      let practice;

      return Practice.findOne()
        .then(function(_practice) {
          practice = _practice;
          return chai
            .request(app)
            .delete(`/practice/${practice.id}`)
            .set("Authorization", `Bearer ${token}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Practice.findById(practice.id);
        })
        .then(function(_practice) {
          expect(_practice).to.be.null;
        });
    });
  });
});
