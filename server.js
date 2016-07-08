var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var app = express();
var soundcloud = require('./soundcloud.js');

app.use(session({ store: new RedisStore({url: "redis://127.0.0.1:6379/1"}), secret: "testSessionSecret", resave: true, saveUninitialized: true }));

app.get('/', function(req, res) {
  res.redirect(soundcloud.connectionURL);
});

app.get('/auth/', function(req, res) {
  req.session.test = "This is a test";
  soundcloud.redirectHandler(req, res);
  soundcloud.testTrack(req, res);
});

app.get('/loggedin/', function(req, res) {
  res.send("Username: " + req.session.username + " Test: " + req.session.test);
  res.end();
});

app.listen(8000, function() {
  console.log('Node app listening on port 8000');
})
