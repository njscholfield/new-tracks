var express = require('express');
var bodyParser = require('body-parser');
var tracks = require('./tracks.js');
var app = express();

app.use(express.static('static'));
app.use(bodyParser.json())

app.post('/:username', function(req, res) {
  var data = req.body;
  var username = req.params.username;
  console.log(username);
  console.log(data);
  res.sendStatus(200);
});

app.listen(8000, function() {
  console.log('Node app listening on port 8000');
})
