const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');

module.exports.register = function(req, res) {
  console.log('registering user');

  var username = req.body.username;
  var name = req.body.name || null;
  var password = req.body.password;

  User.create({
    username: username,
    name: name,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }, function(err, user) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      console.log('User Created', user);
      res.status(201).json(user);
    }
  });
};
