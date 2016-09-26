module.exports = function(app, passport, tracks) {

  app.get('/register', function(req, res) {
    res.render('register', {data: {}, error: {}, message: {type: 'text-danger', content: req.flash('signupMessage')}});
  });

  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  }));

  app.get('/login', function(req, res) {
    res.render('login', {message: req.flash('loginMessage'), error: {}});
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/auth/soundcloud', passport.authenticate('soundcloud'));

  app.get('/auth/soundcloud/callback', passport.authenticate('soundcloud', { failureRedirect: '/login'}), function(req, res) {
    res.redirect('/');
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

}
