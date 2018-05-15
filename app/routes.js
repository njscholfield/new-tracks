module.exports = function(app, passport, tracks, account) {

  app.get('/register/', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/#/' + req.query.hash);
    } else {
      res.render('register', {message: {type: 'text-danger', content: req.flash('signupMessage')}, user: {hide:true}, hash: req.query.hash });
    }
  });

  app.post('/register/', passport.authenticate('local-signup', {
    failureRedirect: '/register/',
    failureFlash: true
  }), function(req, res) {
    res.redirect('/#/' + req.query.hash);
  });

  app.get('/login/', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/#/' + req.query.hash);
    } else {
      res.render('login', {message: req.flash('loginMessage'), error: {}, user: {hide:true}, hash: req.query.hash });
    }
  });

  app.post('/login/', passport.authenticate('local-login', {
    failureRedirect: '/login/',
    failureFlash: true
  }), function(req, res) {
    if(req.body.remember_me) {
      req.session.cookie.maxAge = 10 * 24 * 60 * 60 * 1000; /* 10 days */
    }
    res.redirect('/#/' + req.query.hash);
  });

  app.get('/settings/', isLoggedIn, function(req, res) {
    res.render('profile', {user: req.user, message: req.flash('signupMessage'), success: req.flash('signupSuccess')});
  });

  app.post('/settings/register/', passport.authenticate('local-signup', {
    successRedirect: '/settings/',
    failureRedirect: '/settings/',
    failureFlash: true,
    successFlash: true
  }));

  app.post('/settings/update/email', isLoggedIn, function(req, res) {
    account.updateEmail(req, res);
  });

  app.post('/settings/update/username', isLoggedIn, function(req, res) {
    account.changeUsername(req, res);
  });

  app.post('/settings/update/password', isLoggedIn, function(req, res) {
    account.changePassword(req, res);
  });

  app.post('/settings/update/visibility', isLoggedIn, function(req, res) {
    account.changeProfileVisibility(req, res);
  });

  app.post('/settings/delete-account', isLoggedIn, function(req, res) {
    account.deleteAccount(req, res);
  });

  app.get('/auth/soundcloud', passport.authenticate('soundcloud'));

  app.get('/deauth/soundcloud', isLoggedIn, function(req, res) {
    account.disconnectSoundCloud(req, res);
  });

  app.get('/callback.html', passport.authenticate('soundcloud', { failureRedirect: '/login/'}), function(req, res) {
    res.redirect('/');
  });

  app.get('/auth/verify', function(req, res) {
    if(req.isAuthenticated()) {
      tracks.getCurrentTrack(req.user.username)
        .then(function success(result) {
          res.status(200).json({loggedIn: true, username: req.user.username, resumeTrack: result.currentTrack});
        }, function error() {
          res.status(200).json({loggedIn: true, username: req.user.username});
        });
    } else {
      res.status(200).json({loggedIn: false});
    }
  });

  app.get('/logout/', function(req, res){
    req.logout();
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      }
      res.redirect('/');
    });
    res.clearCookie('sessionID');
  });

  app.get('/api/:username', isAuthorized, function(req, res) {
    tracks.getTracks(req, res);
  });

  app.post('/api/:username/add', isAuthorized, function(req, res) {
    tracks.addTrackToList(req, res);
  });

  app.post('/api/:username/edit', isAuthorized, function(req, res) {
    tracks.editTrackInList(req, res);
  });

  app.post('/api/:username/remove', isAuthorized, function(req, res) {
    tracks.removeTrackFromList(req, res);
  });

  app.post('/api/:username/current', isAuthorized, function(req, res) {
    tracks.updateCurrentTrack(req, res);
  });

  app.get('/:username/', function(req, res) {
    tracks.showUserProfile(req, res);
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('loginMessage', 'You must be logged in to view this page!');
    res.redirect('/login/');
  }

  function isAuthorized(req, res, next) {
    if(req.isAuthenticated() && req.user.username === req.params.username) {
      return next();
    } else {
      res.status(401).json({type: 'error', message: 'It looks like you aren\'t logged in.'});
    }
  }

};
