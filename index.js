var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var tracks = require('./app/tracks.js');
var account = require('./app/account.js');
var app = express();

require('./config/passport.js')(passport);

app.set('trust proxy');
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({ store: new RedisStore({url: process.env.REDIS_URL}), secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, name: 'sessionID', cookie: { secure: 'auto', maxAge: 864000000 /* 10 days */} }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('static'));
app.use(flash());
app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport, tracks, account);

app.listen(app.get('port'), function() {
  console.log('Node app listening on port ' + app.get('port'));
});
