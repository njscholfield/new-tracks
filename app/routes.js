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

  app.get('/auth/soundcloud', passport.authenticate('soundcloud-login'));

  app.get('/auth/soundcloud/callback', passport.authenticate('soundcloud-login', { failureRedirect: '/login'}), function(req, res) {
    res.redirect('/');
  });

  app.get('/auth/test', isLoggedIn, function(req, res) {
    res.send("Logged In " + req.user.username);
  });

  app.get('/logout/', function(req, res){
    req.logout();
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

  function isLoggedIn(req, res, next) {
  	if (req.isAuthenticated()) {
      return next();
    }
    req.flash('loginMessage', 'You must be logged in to view this page!');
  	res.redirect('/login/');
  }

}
