var express = require('express');
var session = require('express-session');
var { MongoStore } = require('connect-mongo');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('./app/flash.js');
var tracks = require('./app/tracks.js');
var account = require('./app/account.js');
var app = express();

require('./config/passport.js')(passport);

var mongoStore = MongoStore.create({
  clientPromise: mongoose.connection.asPromise().then((conn) => conn.getClient()),
  collectionName: 'sessions',
  stringify: false
});
var sess = { store: mongoStore, secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, name: 'sessionID', cookie: { sameSite: 'lax' }};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.set('port', process.env.PORT || 8000);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use(express.static('static'));
app.use(flash());

require('./app/routes.js')(app, passport, tracks, account);

app.listen(app.get('port'), function() {
  console.log('Node app listening on port ' + app.get('port'));
});
