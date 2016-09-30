var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var tracks = require('./app/tracks.js');
var app = express();

require('./config/passport.js')(passport);

app.set('port', process.env.PORT || 8000);
app.use(session({ store: new RedisStore({url: process.env.REDIS_URL}), secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport, tracks);

app.listen(app.get('port'), function() {
  console.log('Node app listening on port ' + app.get('port'));
});
