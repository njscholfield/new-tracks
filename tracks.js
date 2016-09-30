/*TODO
  need to check all and rewrite to reference username instead of permalink
  user will be stored in req.user so searching may not be necessary anymore
  createNewUser will definitely need to be changed
  Rewrite database calls to be more efficient
*/

var models = require('./app/userModel.js');
var user = models.user;
var track = models.track;

exports.getTracks = function(req, res) {
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    getTracksFromDatabase(req, res, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var getTracksFromDatabase = function (req, res, username) {
  user.findOne({username: username}, function(err, result) {
    if(err) {
      console.log('Error searching database: ' + err);
      res.status(500).json({error: err});
    } else {
      res.status(200).json(result);
    }
  });
};

exports.editTrackInList = function(req, res) {
  var data = req.body;
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    editTrackInDatabase(req, res, data, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var editTrackInDatabase = function(req, res, data, username) {
  var newTrack = new track({
    title: data.title,
    artist: data.artist,
    releaseDate: data.releaseDate,
    trackID: data.trackID
  });
  user.findOneAndUpdate({username: username, 'tracks.trackID': data.trackID}, {$set: {'tracks.$': newTrack}}, {new: true}, function(err, result) {
    if(err) {
      console.log('Error updating track: ' + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};

exports.removeTrackFromList = function(req, res) {
  var data = req.body;
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    removeTrackFromDatabase(req, res, data, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var removeTrackFromDatabase = function (req, res, data, username) {
  user.findOneAndUpdate({username: username}, {$pull: {tracks: {trackID: data.trackID} } }, {new: true}, function(err, result) {
    if(err) {
      console.log('Error removing track: ' + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};

exports.addTrackToList = function(req, res) {
  var data = req.body;
  if(req.isAuthenticated() && req.user.username === req.params.username) {
    addTrackToDatabase(req, res, data, req.user.username);
  } else {
    res.sendStatus(403);
  }
};

var addTrackToDatabase = function(req, res, data, username) {
  user.findOne({username: username}, function(err, result) {
    if(err) {
      console.log('Error searching database: ' + err);
      res.status(400).json({error: err});
    } else {
      var newTrack = new track({
        title: data.title,
        artist: data.artist,
        releaseDate: data.releaseDate,
        trackID: data.trackID
      });
      addTrackToExistingUser(req, res, result, newTrack);
    }
  });
};

var addTrackToExistingUser = function(req, res, result, newTrack) {
  user.findOneAndUpdate({_id: result._id}, {$push: {tracks: newTrack}}, {new: true}, function(err, result) {
    if(err) {
      console.log("Error $push new track: " + err);
      res.status(400).json({error: err});
    } else {
      res.status(200).json(result.tracks);
    }
  });
};
