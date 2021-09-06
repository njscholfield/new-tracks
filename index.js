var express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var tracks = require('./app/tracks.js');
var account = require('./app/account.js');
var app = express();

require('./config/passport.js')(passport);

var mongoStore = new MongoDBStore({ uri: process.env.MONGO, collection: 'sessions', connectionOptions: {
  useNewUrlParser: true, useUnifiedTopology: true
}});
var sess = { store: mongoStore, secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: false, name: 'sessionID', cookie: {}};
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
