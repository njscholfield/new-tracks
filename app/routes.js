module.exports = function(app, passport, tracks) {

  app.get('/register', function(req, res) {
    res.render('register', {username: "req.user", data: {}, error: {}, message: {type: 'text-danger', content: req.flash('signupMessage')}});
  });

  app.post('/register', function(req, res) {
    console.log(req.body);
    res.redirect('/');
  });

  app.get('/login', function(req, res) {
    res.render('login', {message: req.flash('loginMessage'), error: {}});
  });

  app.post('/login', function(req, res) {
    console.log(req.body);
    res.redirect('/');
  });

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
