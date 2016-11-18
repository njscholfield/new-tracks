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

var sess = { store: new RedisStore({url: process.env.REDIS_URL}), secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, name: 'sessionID', cookie: {}};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.set('port', process.env.PORT || 8000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('static'));
app.use(flash());

require('./app/routes.js')(app, passport, tracks, account);

app.listen(app.get('port'), function() {
  console.log('Node app listening on port ' + app.get('port'));
});
