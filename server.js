var express = require('express');
var bodyParser = require('body-parser');
var tracks = require('./tracks.js');
var app = express();

app.set('port', process.env.PORT || 8000);
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/:username', function(req, res) {
  tracks.getTracks(req, res);
});

app.post('/:username/add', function(req, res) {
  tracks.addTrackToList(req, res);
});

app.post('/:username/edit', function(req, res) {
  tracks.editTrackInList(req, res);
});

app.post('/:username/remove', function(req, res) {
  tracks.removeTrackFromList(req, res);
});

app.listen(app.get('port'), function() {
  console.log('Node app listening on port ' + app.get('port'));
});
