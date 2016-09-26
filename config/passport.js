var localStrategy = require('passport-local').Strategy;
var soundcloudStrategy = require('passport-soundcloud').Strategy;

var User = require('../app/userModel.js');

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

  passport.use('soundcloud-login', new soundcloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: "https://tracks.noahscholfield.com/callback.html"
    //callbackURL: "http://127.0.0.1:8000/auth/soundcloud/callback" //change for production
    // maybe try using state for authorize vs authenticate
  },
    function(accessToken, refreshToken, profile, done) {
      // this will not work for the first time in production
      // apparently you need to have mongoose write soundcloud.soundcloudID for it to be able to find it
      // migration function? or just manual migration in mLab?
      User.findOneAndUpdate({ 'soundcloud.soundcloudID': profile.id }, {$set: {'soundcloud.accessToken': accessToken, 'soundcloud.refreshToken': refreshToken}}, function (err, user) {
        if(err) {
          console.log('Error looking for user' + err);
          return done(err);
        }
        return done(null, user);
      });
    }
  ));

}
