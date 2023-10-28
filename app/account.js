var User = require('./userModel.js').user;

exports.updateEmail = async function(req, res) {
  var data = req.body;

  try {
    const user = await User.findOne({'local.email': data.email});
    if (user || data.email.length === 0) {
      req.flash('signupMessage', 'That email address is already being used or is invalid!');
      res.redirect('/settings/');
    } else {
      try {
        await req.user.updateOne({ $set: { 'local.email': data.email } });
        req.flash('signupSuccess', 'Email address successfully updated!');
      } catch(err) {
        console.log('Error updating email address: ' + err);
        req.flash('signupMessage', 'Error updating email address.');
      }
      res.redirect('/settings/');

    }
  } catch(e) {
    console.log('Error checking for used email address: ' + e);
    req.flash('signupMessage', 'Error updating email address.');
    res.redirect('/settings/');
  }
};

exports.changeUsername = async function(req, res) {
  var data = req.body;

  try {
    const user = await User.findOne({username: data.username});

    if (user || req.user.invalidUsername(data.username)) {
      req.flash('signupMessage', 'That username is already being used or is invalid!');
      res.redirect('/settings/');
    } else {
      try {
        await req.user.updateOne({ $set: { username: data.username } });
        req.flash('signupSuccess', 'Username successfully updated!');
      } catch(err) {
        console.log('Error updating username: ' + err);
        req.flash('signupMessage', 'Error updating username.');
      }
      res.redirect('/settings/');
    }
  } catch(err) {
    console.log('Error checking for used username: ' + err);
    req.flash('signupMessage', 'Error updating username.');
    res.redirect('/settings/');
  }
};

exports.changePassword = async function(req, res) {
  var data = req.body;

  if(!req.user.validPassword(data.currentPassword)) {
    req.flash('signupMessage', 'Current password is incorrect!');
    res.redirect('/settings/');
  } else if(data.newPassword1 !== data.newPassword2 || data.newPassword1.length > 72 || data.newPassword1.length < 8) {
    req.flash('signupMessage', 'New passwords do not match or are not 8-72 characters');
    res.redirect('/settings/');
  } else {
    req.user.local.password = req.user.generateHash(data.newPassword1);
    try {
      await req.user.save();
      req.flash('signupSuccess', 'Password successfully changed!');
    } catch(err) {
      console.log('Error changing password: ' + err);
      req.flash('signupMessage', 'Error changing password!');
    }
    res.redirect('/settings/');
  }
};

exports.changeProfileVisibility = async function(req, res) {
  var newVisibility = req.body.profileVisibility;

  try {
    await req.user.updateOne({$set: {profileVisibility: newVisibility}});
    req.flash('signupSuccess', 'Profile visibility successfully changed.');
  } catch(err) {
    console.log('Error changing profile visibility: ' + err);
    req.flash('signupMessage', 'Error changing profile visibility.');
  }
  res.redirect('/settings/');
};

exports.disconnectSoundCloud = async function(req, res) {
  if(!req.user.local.email) {
    res.redirect('/settings/');
  } else {
    req.user.soundcloud = {};
    try {
      await req.user.save();
      req.flash('signupSuccess', 'Your account is now disconnected from SoundCloud');
    } catch(err) {
      req.flash('signupMessage', 'Error disconnecting SoundCloud');
      console.log('Error disconnecting SoundCloud: ' + err);
    }
    res.redirect('/settings/');
  }
};

exports.deleteAccount = async function(req, res) {
  var password = req.body.password;

  if(req.user.validPassword(password)) {
    try {
      await User.deleteOne({username: req.user.username});
      res.redirect('/logout/');
    } catch(err) {
      console.log('Error deleting account: ' + err);
      req.flash('signupMessage', 'Error deleting account');
      res.redirect('/settings/');
    }
  } else {
    req.flash('signupMessage', 'Password is incorrect');
    res.redirect('/settings/');
  }
};
