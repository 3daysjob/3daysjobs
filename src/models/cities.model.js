const mongoose = require('mongoose');
const { v4 } = require('uuid');

const citieSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    City: {
      type: String,
    },
    Lat: {
      type: Number,
    },
    Long: {
      type: Number,
    },
    country: {
      type: String,
    },
    iso2: {
      type: String,
    },
    State: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Cities = mongoose.model('cities', citieSchema);

module.exports = {
  Cities,
};
