const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  stars : {
    type : Number,
    min : 0,
    max : 5,
    "default" : 0
  },
  services : [String],
  description : String,
  photos : [String],
  currency : String,
  reviews : [reviewSchema],
  rooms : [roomSchema],
  location : {
    address : String,
    // Always store coordinates longitude (E,W), latitude (N,S) order
    coordinates : {
      type : [Number],
      index : '2dsphere'
    }
  }
});

mongoose.model('Hotel', hotelSchema);
