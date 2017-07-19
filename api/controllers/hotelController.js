const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Hotel = mongoose.model('Hotel');

const runGeoQuery = function(req, res) {

  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  if (isNaN(lng) || isNaN(lat)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, lng and lat must both be numbers"
      });
    return;
  }

  // A geoJSON point
  var point = {
    type : "Point",
    coordinates : [lng, lat]
  };

  var geoOptions = {
    spherical : true,
    maxDistance : 2000,
    num : 5
  };

  Hotel
    .geoNear(point, geoOptions, function(err, results, stats) {
      console.log('Geo results', results);
      console.log('Geo stats', stats);
      if(err) {
        console.log("Error finding hotels");
        res
          .status(500)
          .json(err);
      } else {
        res
          .status(200)
          .json(results);
      }
    });
};

module.exports.hotelsGetAll = function (req, res) {
  console.log('Requested by: ' + req.user);
  console.log("GET the hotels");
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 10;

  if (req.query && req.query.lat && req.query.lng) {
    runGeoQuery(req,res);
    return
  };

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  };

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  };

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring count and offset should be numbers"
      });
    return;
  };

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
  return;
  }

  Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, hotels) {
      console.log(err);
      console.log(hotels);
      if (err) {
        console.log("Error finding hotels");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found Hotels", hotels.length);
        res
          .json(hotels);
      }
    });

};

module.exports.hotelsGetOne = function (req, res) {
  var id = req.params.hotelId;

  console.log('GET hotelId', id);

  Hotel
    .findById(id)
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Hotel ID not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });

};
 
