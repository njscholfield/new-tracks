module.exports = function(app, tracks) {

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
