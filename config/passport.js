var localStrategy = require('passport-local').Strategy;
var soundcloudStrategy = require('passport-soundcloud').Strategy;

var User = require('../app/userModel.js').user;

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

      if(password !== data.newPassword2 || password.length > 72 || password.length < 8) {
        return done(null, false, req.flash('signupMessage', 'Passwords do not match or are not 8-72 characters'))
      }

      if(!req.user) {
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
                console.log('Error creating new account: ' + err);
                return done(err);
              }
              return done(null, newUser);
            });
          }
        });
      } else {
        if(req.user.username !== username) {
          var testUsername = username;
        }

        User.findOne({$or: [{'local.email': data.inputEmail}, {username: testUsername}]}, function(err, user) {
          if(err) {
            console.log('Error searching for used username or email: ' + err);
            return done(err);
          } else {
            if(user && user.username === username && username !== req.user.username) {
              return done(null, false, req.flash('signupMessage', 'That username has already been taken.'));
            } else if(user && user.local.email === data.inputEmail) {
              return done(null, false, req.flash('signupMessage', 'That email address is already in use.'));
            } else {
              req.user.username = username;
              req.user.local.email = data.inputEmail;
              req.user.local.password = req.user.generateHash(password);

              req.user.save(function(err) {
                if(err) {
                  console.log('Error saving updated user: ' + err);
                  return done(err);
                }
                return done(null, req.user, req.flash('signupSuccess', 'Information successfully updated!'));
              });
            }
          }
        });

        //end
      }
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

  passport.use('soundcloud', new soundcloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: "https://tracks.noahscholfield.com/callback.html",
    passReqToCallback: true
  },
    function(req, accessToken, refreshToken, profile, done) {
      if(!req.user) {
        // login using SoundCloud
        // remove $or after migration just { 'soundcloud.soundcloudID': profile.id }
        User.findOne({ $or: [{ 'soundcloud.soundcloudID': profile.id }, { 'userID': profile.id }] }, function(err, user) {
          if(err) {
            console.log('Error searching for user: ' + err);
            return done(err);
          } else {
            if(user) {
              // login the user with the SoundCloud account
              if(user.userID) { //migration of userID to soundcloud.soundcloudID // remove from here -
                user.update({$set: {'soundcloud.soundcloudID': user.userID, username: user.permalink}, $unset: {'userID': "", permalink: ""}}, function(err, user) {
                  if(err) {
                    console.log('Error migrating userID to soundcloud.soundcloudID: ' + err);
                  }
                });
              } // remove through here
              user.update({$set: {'soundcloud.accessToken': accessToken, 'soundcloud.refreshToken': refreshToken}}, function(err, result) {
                if(err) {
                  console.log('Error adding accessToken and refreshToken: ' + err);
                  return done(err);
                } else {
                  return done(null, user);
                }
              });
            } else {
              // create new account with the SoundCloud account
              var newUser = new User();
              newUser.username = profile._json.permalink;
              newUser.soundcloud.soundcloudID = profile.id;
              newUser.soundcloud.accessToken = accessToken;
              newUser.soundcloud.refreshToken = refreshToken;

              newUser.save(function(err) {
                if(err) {
                  console.log('Error creating new account: ' + err);
                  return done(err);
                }
                return done(null, newUser);
              });
            }
          }
        });
      } else {
        // connect SoundCloud
        req.user.update({$set: {'soundcloud.soundcloudID': profile.id, 'soundcloud.accessToken': accessToken, 'soundcloud.refreshToken': refreshToken}}, function(err, result) {
          if(err) {
            console.log('Error connnecting SoundCloud: ' + err);
            return done(err);
          } else {
            return done(null, req.user);
          }
        });
      }
    }
  ));

}
