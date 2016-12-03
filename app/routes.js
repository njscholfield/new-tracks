module.exports = function(app, passport, tracks, account) {

  app.get('/register/', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('register', {message: {type: 'text-danger', content: req.flash('signupMessage')}, user: {} });
    }
  });

  app.post('/register/', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register/',
    failureFlash: true
  }));

  app.get('/login/', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('login', {message: req.flash('loginMessage'), error: {}, user: {} });
    }
  });

  app.post('/login/', passport.authenticate('local-login', {
    failureRedirect: '/login/',
    failureFlash: true
  }), function(req, res) {
    if(req.body.remember_me) {
      req.session.cookie.maxAge = 10 * 24 * 60 * 60 * 1000; /* 10 days */
    }
    res.redirect('/');
  });

  app.get('/profile/', isLoggedIn, function(req, res) {
    res.render('profile', {user: req.user, message: req.flash('signupMessage'), success: req.flash('signupSuccess')});
  });

  app.post('/profile/register/', passport.authenticate('local-signup', {
    successRedirect: '/profile/',
    failureRedirect: '/profile/',
    failureFlash: true,
    successFlash: true
  }));

  app.post('/profile/update/email', isLoggedIn, function(req, res) {
    account.updateEmail(req, res);
  });

  app.post('/profile/update/username', isLoggedIn, function(req, res) {
    account.changeUsername(req, res);
  });

  app.post('/profile/update/password', isLoggedIn, function(req, res) {
    account.changePassword(req, res);
  });

  app.post('/profile/update/visibility', isLoggedIn, function(req, res) {
    account.changeProfileVisibility(req, res);
  });

  app.post('/profile/delete-account', isLoggedIn, function(req, res) {
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
      res.status(200).json({loggedIn: true, username: req.user.username});
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

  app.get('/:username', function(req, res) {
    tracks.getTracks(req, res);
  });

  app.post('/:username/add', function(req, res) {
    tracks.addTrackToList(req, res);
  });

  app.post('/:username/edit', function(req, res) {
    tracks.editTrackInList(req, res);
  });

  app.post('/:username/remove', function(req, res) {
    tracks.removeTrackFromList(req, res);
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('loginMessage', 'You must be logged in to view this page!');
    res.redirect('/login/');
  }

};
