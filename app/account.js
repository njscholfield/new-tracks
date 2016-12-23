var User = require('./userModel.js').user;

exports.updateEmail = function(req, res) {
  var data = req.body;

  User.findOne({'local.email': data.email}, function(err, user){
    if(err) {
      console.log('Error checking for used email address: ' + err);
      req.flash('signupMessage', 'Error updating email address.');
      res.redirect('/settings/');
    } else {
      if(user || data.email.length === 0) {
        req.flash('signupMessage', 'That email address is already being used or is invalid!');
        res.redirect('/settings/');
      } else {
        req.user.update({$set: {'local.email': data.email}}, function(err) {
          if(err) {
            console.log('Error updating email address: ' + err);
            req.flash('signupMessage', 'Error updating email address.');
          } else {
            req.flash('signupSuccess', 'Email address successfully updated!');
          }
          res.redirect('/settings/');
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
      res.redirect('/settings/');
    } else {
      if(user || req.user.invalidUsername(data.username)) {
        req.flash('signupMessage', 'That username is already being used or is invalid!');
        res.redirect('/settings/');
      } else {
        req.user.update({$set: {username: data.username}}, function(err) {
          if(err) {
            console.log('Error updating username: ' + err);
            req.flash('signupMessage', 'Error updating username.');
          } else {
            req.flash('signupSuccess', 'Username successfully updated!');
          }
          res.redirect('/settings/');
        });
      }
    }
  });
};

exports.changePassword = function(req, res) {
  var data = req.body;

  if(!req.user.validPassword(data.currentPassword)) {
    req.flash('signupMessage', 'Current password is incorrect!');
    res.redirect('/settings/');
  } else if(data.newPassword1 !== data.newPassword2 || data.newPassword1.length > 72 || data.newPassword1.length < 8) {
    req.flash('signupMessage', 'New passwords do not match or are not 8-72 characters');
    res.redirect('/settings/');
  } else {
    req.user.local.password = req.user.generateHash(data.newPassword1);
    req.user.save(function(err) {
      if(err) {
        console.log('Error changing password: ' + err);
        req.flash('signupMessage', 'Error changing password!');
      } else {
        req.flash('signupSuccess', 'Password successfully changed!');
      }
      res.redirect('/settings/');
    });
  }
};

exports.changeProfileVisibility = function(req, res) {
  var newVisibility = req.body.profileVisibility;

  req.user.update({$set: {profileVisibility: newVisibility}}, function(err) {
    if(err) {
      console.log('Error changing profile visibility: ' + err);
      req.flash('signupMessage', 'Error changing profile visibility.');
      res.redirect('/settings/');
    } else {
      req.flash('signupSuccess', 'Profile visibility successfully changed.');
      res.redirect('/settings/');
    }
  });
};

exports.disconnectSoundCloud = function(req, res) {
  if(!req.user.local.email) {
    res.redirect('/settings/');
  } else {
    req.user.soundcloud = {};
    req.user.save(function(err) {
      if(err) {
        req.flash('signupMessage', 'Error disconnecting SoundCloud');
        console.log('Error disconnecting SoundCloud: ' + err);
      } else {
        req.flash('signupSuccess', 'Your account is now disconnected from SoundCloud');
      }
      res.redirect('/settings/');
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
        res.redirect('/settings/');
      } else {
        req.logout();
        req.session.destroy();
        res.redirect('/');
      }
    });
  } else {
    req.flash('signupMessage', 'Password is incorrect');
    res.redirect('/settings/');
  }
};
