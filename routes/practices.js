const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { Practice } = require("../models/practice");

router.get("/", (req, res) => {
  Practice.find({userId:req.user.id})
    .then(practices => {
      res.json(practices.map(practice => practice.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/", jsonParser, (req, res) => {
  console.log(req.user)
  const requiredFields = ["timePracticed"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\`. Please put in the required field(s).`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  return Practice.create({
    date: req.body.date,
    timePracticed: req.body.timePracticed,
    scales: req.body.scales,
    otherMusic: req.body.otherMusic,
    userId: req.user.id
  })

    .then(practice => {
      console.log(practice);
      res.status(201).json(practice.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.put("/:id", jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ["date", "timePracticed", "scales", "otherMusic"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]; 
    }
  });

  Practice.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(() => res.status(204).end())
    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
});

router.delete("/:id", (req, res) => {
  Practice.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(() => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router;
