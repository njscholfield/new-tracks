var User = require('./userModel.js').user;

exports.updateEmail = function(req, res) {
  var data = req.body;

  User.findOne({'local.email': data.email}, function(err, user){
    if(err) {
      console.log('Error checking for used email address: ' + err);
      req.flash('signupMessage', 'Error updating email address.');
      res.redirect('/profile');
    } else {
      if(user) {
        req.flash('signupMessage', 'That email address is already being used!');
        res.redirect('/profile');
      } else {
        req.user.update({$set: {'local.email': data.email}}, function(err) {
          if(err) {
            console.log('Error updating email address: ' + err);
            req.flash('signupMessage', 'Error updating email address.');
          } else {
            req.flash('signupSuccess', 'Email address successfully updated!');
          }
          res.redirect('/profile');
        });
      }
    }
  });
};

exports.changeUsername = function(req, res) {
  var data = req.body;

  User.findOne({username: data.username}, function(err, user){
    if(err) {
      console.log('Error checking for used username: ' + err);
      req.flash('signupMessage', 'Error updating username.');
      res.redirect('/profile');
    } else {
      if(user) {
        req.flash('signupMessage', 'That username is already being used!');
        res.redirect('/profile');
      } else {
        req.user.update({$set: {username: data.username}}, function(err) {
          if(err) {
            console.log('Error updating username: ' + err);
            req.flash('signupMessage', 'Error updating username.');
          } else {
            req.flash('signupSuccess', 'Username successfully updated!');
          }
          res.redirect('/profile');
        });
      }
    }
  });
};

exports.changePassword = function(req, res) {
  var data = req.body;

  if(!req.user.validPassword(data.currentPassword)) {
    req.flash('signupMessage', 'Current password is incorrect!');
    res.redirect('/profile');
  } else if(data.newPassword1 !== data.newPassword2 || data.newPassword1.length > 72 || data.newPassword1.length < 8) {
    req.flash('signupMessage', 'New passwords do not match or are not 8-72 characters');
    res.redirect('/profile');
  } else {
    req.user.local.password = req.user.generateHash(data.newPassword1);
    req.user.save(function(err) {
      if(err) {
        console.log('Error changing password: ' + err);
        req.flash('signupMessage', 'Error changing password!');
      } else {
        req.flash('signupSuccess', 'Password successfully changed!');
      }
      res.redirect('/profile');
    });
  }
};

exports.disconnectSoundCloud = function(req, res) {
  if(!req.user.local.email) {
    req.flash('signupMessage', 'You cannot disconnect SoundCloud from a SoundCloud only account. If you would like to switch to username and password sign in, add a password below.');
    res.redirect('/profile');
  } else {
    req.user.soundcloud = {};
    req.user.save(function(err) {
      if(err) {
        req.flash('signupMessage', 'Error disconnecting SoundCloud');
        console.log('Error disconnecting SoundCloud: ' + err);
      } else {
        req.flash('signupSuccess', 'Your account is now disconnected from SoundCloud');
      }
      res.redirect('/profile');
    });
  }
};

exports.deleteAccount = function(req, res) {
  var password = req.body.password;

  if(req.user.validPassword(password)) {
    User.remove({username: req.user.username}, function(err) {
      if(err) {
        console.log('Error deleting account: ' + err);
        req.flash('signupMessage', 'Error deleting account');
        res.redirect('/profile/');
      } else {
        req.logout();
        req.session.destroy();
        res.redirect('/');
      }
    });
  } else {
    req.flash('signupMessage', 'Password is incorrect');
    res.redirect('/profile/');
  }
};
