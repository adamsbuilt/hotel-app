require('./api/data/db.js');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./api/routes');

// Define the port to run on
app.set('port', 3000);

// Add middleware to console log every request
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Enable parsing of posted forms
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Add some routing
app.use('/api', routes);

// Listen for requests
const server = app.listen(app.get('port'), function() {
  const port = server.address().port;
  console.log('Magic happens on port ' + port);
});
