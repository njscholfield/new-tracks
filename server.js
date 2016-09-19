var express = require('express');
var bodyParser = require('body-parser');
var tracks = require('./tracks.js');
var app = express();

app.set('port', process.env.PORT || 8000);
app.use(express.static('static'));
app.use(bodyParser.json());

require('./app/routes.js')(app, tracks);

app.listen(app.get('port'), function() {
  console.log('Node app listening on port ' + app.get('port'));
});
