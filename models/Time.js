'use strict';

const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const TimeSchema = new Schema({
  employeeId: {
    type: Number,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  clockIn: {
    type: Date,
    default: Date.now()
  },
  clockOut: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

module.exports = mongoose.model(`Time`, TimeSchema);