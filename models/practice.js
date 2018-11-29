'use strict';

const mongoose = require('mongoose');

const practiceSchema = mongoose.Schema({
  date: { type: String, required: false },
  timePracticed: { type: Number, required: true },
  scales: { type: String, required: false },
  otherMusic: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

practiceSchema.methods.serialize = function() {
  return {
    id: this._id,
    date: this.date,
    timePracticed: this.timePracticed,
    scales: this.scales,
    otherMusic: this.otherMusic,
    userId: this.userId 
  };
};

const Practice = mongoose.model('Practice', practiceSchema);

module.exports = { Practice };
