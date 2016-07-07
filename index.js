var express = require('express');
var mongoose = require('mongoose');
var SC = require('node-soundcloud');
var app = express();

SC.init({
  id: '30cba84d4693746b0a2fbc0649b2e42c',
  secret: '8d2b6ec520fca0e07fd6b57a83d9d428',
  uri: 'http://localhost:8000/auth/'
});

app.get('/', function(req, res) {
  res.redirect(SC.getConnectUrl());
});

app.get('/auth/', function(req, res) {
  redirectHandler(req, res);
  SC.get('/tracks/265846358', function(err, track) {
    if(err) {
      console.log(err);
    } else {
      res.json(track);
    }
  })
})

var redirectHandler = function(req, res) {
  var code = req.query.code;

  SC.authorize(code, function(err, accessToken) {
    if ( err ) {
      throw err;
    } else {
      // Client is now authorized and able to make API calls
      console.log('access token:', accessToken);
    }
  });
};

app.listen(8000, function() {
  console.log('Node app listening on port 8000');
})
