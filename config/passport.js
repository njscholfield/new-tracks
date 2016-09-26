var localStrategy = require('passport-local').Strategy;
var soundcloudStrategy = require('passport-soundcloud').Strategy;

var User = require('./app/userModel.js');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
  });

  passport.use('local-signup', new localStrategy({
    usernameField: 'inputUsername',
    passwordField: 'newPassword1',
    passReqToCallback: true
  },
    function(req, username, password, done) {
      var data = req.body;
      User.findOne({$or: [{'local.email': data.inputEmail}, {username: username}]}, function(err, user) {
        if(err){
          return done(err);
        }

        if(user) {
          if(user.username === username) {
            return done(null, false, req.flash('signupMessage', 'That username has already been taken.'));
          }
          return done(null, false, req.flash('signupMessage', 'That email address is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.email = data.inputEmail;
          newUser.username = username;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      })
    }
  ));

  passport.use('local-login', new localStrategy({
    passReqToCallback: true
  },
    function(req, username, password, done) {
      User.findOne({username: username}, function(err, user) {
        if(err) {
          return done(err);
        }
        if(!user) {
          return done(null, false, req.flash('loginMessage', 'User not found.'));
        }
        if(!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Incorrect Password!'));
        }

        return done(null, user);
      });
    }
  ));

  passport.use(new SoundCloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8000/auth/soundcloud/callback" //change for production
  },
    function(accessToken, refreshToken, profile, done) {
      // replace this with something functional
      User.findOrCreate({ 'soundcloud.soundcloudID': profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));

}
